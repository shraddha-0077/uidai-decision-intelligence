
from pydantic import BaseModel
from enum import Enum
from typing import Optional

class Severity(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class SignalType(str, Enum):
    RISK = "RISK"
    ANOMALY = "ANOMALY"
    COVERAGE = "COVERAGE"
    DEMOGRAPHIC = "DEMOGRAPHIC"

class DecisionSignal(BaseModel):
    id: str
    type: SignalType
    title: str
    district: str
    severity: Severity
    data_summary: str
    why_it_matters: str
    recommended_action: str
    metric_value: float
    trend: str
