
import { LFIMetrics, DistrictALDPI, InactionRisk, ForecastPoint } from '../types';

/**
 * Composite Risk Score (CRS)
 * A transparent, weighted multi-factor score (0.0 - 1.0)
 */
export const calculateCRS = (metrics: LFIMetrics): number => {
  const weights = {
    backlog: 0.35,
    delay: 0.25,
    capacity: 0.25,
    volatility: 0.15
  };

  const score = 
    (metrics.pendencyRatio * weights.backlog) +
    ((1 - metrics.updateRatio) * weights.delay) +
    (metrics.capacityUtilization * weights.capacity) +
    (metrics.volatility * weights.volatility);
  
  return Math.min(Math.max(score, 0), 1);
};

export const calculateLFI = calculateCRS; // Maintain alias

/**
 * Simple simulation of LFI recovery based on resource allocation
 */
export const simulateRecovery = (currentLfi: number, resourceDelta: number): number => {
  const frictionReductionPerKit = 0.04; // 4% reduction per unit
  const result = currentLfi - (resourceDelta * frictionReductionPerKit);
  return Math.max(0, Math.min(1, result));
};

/**
 * Predicts volume for next 4 months using simple linear regression with seasonality
 */
export const generateForecast = (baseVolume: number): ForecastPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const forecast: ForecastPoint[] = [];

  for (let i = 1; i <= 4; i++) {
    const idx = (currentMonthIdx + i) % 12;
    // Simple seasonality + growth trend simulation
    const seasonality = 1 + (Math.sin(idx) * 0.1);
    const growth = 1 + (i * 0.02);
    const projected = baseVolume * seasonality * growth;
    
    forecast.push({
      month: months[idx],
      projectedVolume: Math.round(projected),
      confidenceLower: Math.round(projected * 0.92),
      confidenceUpper: Math.round(projected * 1.08)
    });
  }
  return forecast;
};

/**
 * Cost of Inaction (COI) Projections
 */
export const projectInactionRisk = (currentCrs: number, trend: 'UP' | 'DOWN'): InactionRisk => {
  const multiplier = trend === 'UP' ? 1.08 : 1.02;
  const p14 = Math.min(currentCrs * Math.pow(multiplier, 1), 1);
  const p30 = Math.min(currentCrs * Math.pow(multiplier, 2.5), 1);
  
  const impactSummary = trend === 'UP' 
    ? `If no corrective action is initiated, update backlog is projected to increase by ${((p30/currentCrs - 1) * 100).toFixed(0)}% within 30 days.`
    : `Stable trend, but baseline friction persists. Inaction results in wasted operational capacity.`;

  return {
    projection14d: p14,
    projection30d: p30,
    impactSummary,
    potentialLossOfSLA: p30 > 0.7 ? "High probability of breach in rural block SLAs." : "Low risk to current SLAs."
  };
};

export const simulatePolicyScenario = (
  district: DistrictALDPI, 
  params: { delayDays: number; resourceDelta: number }
): { crs: number; lfi: number; riskStatus: 'HEALTHY' | 'MODERATE' | 'CRITICAL'; impactDelta: number } => {
  const { delayDays, resourceDelta } = params;
  const m = district.metrics;
  
  const delayEffect = delayDays / 10;
  const simulatedPendency = Math.min(m.pendencyRatio * (1 + (0.12 * delayEffect)), 1);
  const resourceEffect = resourceDelta * 0.08;
  const simulatedCapacity = Math.max(Math.min(m.capacityUtilization - resourceEffect, 1), 0);
  
  const simulatedMetrics: LFIMetrics = {
    ...m,
    pendencyRatio: simulatedPendency,
    capacityUtilization: simulatedCapacity
  };
  
  const newCrs = calculateCRS(simulatedMetrics);
  const impactDelta = newCrs - district.crs;
  
  let riskStatus: 'HEALTHY' | 'MODERATE' | 'CRITICAL' = 'HEALTHY';
  if (newCrs > 0.65) riskStatus = 'CRITICAL';
  else if (newCrs > 0.4) riskStatus = 'MODERATE';
  
  return {
    crs: newCrs,
    lfi: newCrs,
    riskStatus,
    impactDelta
  };
};