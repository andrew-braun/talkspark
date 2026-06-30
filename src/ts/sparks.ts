// Re-export barrel — existing consumers import SparkData from 'ts/sparks' and compile unchanged.
// The full Spark type and all categorical unions live in ./spark.ts.
export type { SparkData, Spark } from './spark';
