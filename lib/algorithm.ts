import { SelectSalary } from "@/types/model.type";
import { differenceInMonths, getDate, getDay, getDaysInMonth } from "date-fns-jalali";

interface PredictionResult {
  probabilityPercent: number;
  details: {
    baseDayChance: number;
    timeWindowModifier: number;
    dayOfWeekModifier: number;
    intraDayDecay: number;
  };
}

export class SalaryPredictor {
  private lambda = 0.15;
  private cleanedData: SelectSalary[] = [];
  private meanRelativeDay: number = 0;
  private stdDevRelativeDay: number = 1;
  private peakHour: number = 0;
  private hourBuckets: Map<number, number> = new Map();

  constructor(private rawData: SelectSalary[]) {
    this.trainModel();
  }

  private getRelativeDay(date: Date): number {
    const day = getDate(date);
    const daysInMonth = getDaysInMonth(date);
    if (day > 15) return day - daysInMonth;
    return day;
  }

  private trainModel() {
    const now = new Date();

    let tempData = this.rawData.map((record) => {
      const monthsDiff = Math.max(0, differenceInMonths(now, record.paidAt));
      const weight = Math.exp(-this.lambda * monthsDiff);
      const relativeDay = this.getRelativeDay(record.paidAt);
      const hour = parseInt(record.paidTime.split(":")[0], 10);
      return { ...record, weight, relativeDay, hour };
    });

    const totalWeight = tempData.reduce((sum, r) => sum + r.weight, 0);
    const weightedMean = tempData.reduce((sum, r) => sum + r.relativeDay * r.weight, 0) / totalWeight;

    const variance = tempData.reduce((sum, r) => sum + r.weight * Math.pow(r.relativeDay - weightedMean, 2), 0) / totalWeight;
    const stdDev = Math.sqrt(variance);

    this.cleanedData = tempData.filter((r) => {
      const zScore = Math.abs(r.relativeDay - weightedMean) / (stdDev || 1);
      return zScore <= 2.0;
    });

    const newTotalWeight = this.cleanedData.reduce((sum, r: any) => sum + r.weight, 0);
    this.meanRelativeDay = this.cleanedData.reduce((sum, r: any) => sum + r.relativeDay * r.weight, 0) / newTotalWeight;
    this.stdDevRelativeDay = Math.sqrt(
      this.cleanedData.reduce((sum, r: any) => sum + r.weight * Math.pow(r.relativeDay - this.meanRelativeDay, 2), 0) / newTotalWeight,
    );

    this.cleanedData.forEach((r: any) => {
      const bucket = Math.floor(r.hour / 2) * 2;
      this.hourBuckets.set(bucket, (this.hourBuckets.get(bucket) || 0) + r.weight);
    });

    let maxWeight = 0;
    this.hourBuckets.forEach((weight, bucket) => {
      if (weight > maxWeight) {
        maxWeight = weight;
        this.peakHour = bucket;
      }
    });
  }

  public predict(targetDate: Date): PredictionResult {
    const targetRelativeDay = this.getRelativeDay(targetDate);
    const distanceToPeakDay = targetRelativeDay - this.meanRelativeDay;
    const dayChance = Math.exp(-Math.pow(distanceToPeakDay, 2) / (2 * Math.pow(this.stdDevRelativeDay || 1, 2)));

    const dow = getDay(targetDate);
    let dowModifier = 1.0;
    if (dow === 5) dowModifier = 0.05;
    if (dow === 4) dowModifier = 0.6;

    const targetHour = targetDate.getHours();
    const targetBucket = Math.floor(targetHour / 2) * 2;
    const bucketWeight = this.hourBuckets.get(targetBucket) || 0;
    const maxBucketWeight = Math.max(...Array.from(this.hourBuckets.values()));

    const timeModifier = maxBucketWeight > 0 ? 0.2 + 0.8 * (bucketWeight / maxBucketWeight) : 1;

    let intraDayDecay = 1.0;
    if (targetHour > this.peakHour) {
      const k = 0.6;
      const hoursPassed = targetHour - this.peakHour;
      intraDayDecay = 1 - 1 / (1 + Math.exp(-k * (hoursPassed - 2)));
    }

    const rawProbability = dayChance * dowModifier * timeModifier * intraDayDecay;

    const probabilityPercent = Math.min(100, Math.max(0, rawProbability * 100));

    return {
      probabilityPercent: parseFloat(probabilityPercent.toFixed(2)),
      details: {
        baseDayChance: parseFloat(dayChance.toFixed(4)),
        timeWindowModifier: parseFloat(timeModifier.toFixed(4)),
        dayOfWeekModifier: dowModifier,
        intraDayDecay: parseFloat(intraDayDecay.toFixed(4)),
      },
    };
  }
}
