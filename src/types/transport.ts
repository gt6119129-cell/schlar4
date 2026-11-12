export type VehicleType = 'Standard Bus' | 'Mini-Bus' | 'Van';
export type VehicleOperationalStatus = 'active' | 'maintenance' | 'out-of-service' | 'standby';
export type TransportServiceType = 'two-way' | 'morning-only' | 'afternoon-only';
export type TransportAssignmentStatus = 'active' | 'suspended' | 'cancelled';
export type TransportFeeStatus = 'paid' | 'pending' | 'overdue';
export type BoardingStatus = 'boarded' | 'absent' | 'unmarked';
export type MaintenanceStatus = 'completed' | 'in-progress' | 'scheduled';
export type IncidentSeverity = 'low' | 'medium' | 'high';
export type IncidentStatus = 'resolved' | 'investigating' | 'open';
export type ExpenseCategory = 'Fuel' | 'Repairs' | 'Scheduled Maintenance' | 'Insurance' | 'Permits & Taxes' | 'Driver Allowances' | 'Safety Equipment';

export interface RouteStop {
  id: string;
  stopName: string;
  sequenceOrder: number;
  morningPickupTime: string; // e.g. "07:15 AM"
  afternoonDropTime: string;  // e.g. "03:45 PM"
  landmark?: string;
  studentCount: number;
}

export interface TransportRoute {
  id: string;
  routeNumber: string; // e.g. "Route R-01"
  name: string;        // e.g. "North Cambridge & Somerville Corridor"
  description: string;
  status: 'active' | 'inactive' | 'seasonal';
  assignedVehicleId: string;
  assignedVehicleNumber: string; // e.g. "Bus #04"
  vehicleCapacity: number;
  assignedDriverId: string;
  assignedDriverName: string;
  assignedAttendantId?: string;
  assignedAttendantName?: string;
  stops: RouteStop[];
  totalStops: number;
  morningStartTime: string;
  morningEndTime: string;
  afternoonStartTime: string;
  afternoonEndTime: string;
  assignedStudentCount: number;
  monthlyFee: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. "MA-SCH-8841"
  vehicleNumber: string;      // e.g. "Bus #01"
  type: VehicleType;
  makeModel: string;          // e.g. "Blue Bird All American (2022)"
  seatingCapacity: number;
  operationalStatus: VehicleOperationalStatus;
  assignedRouteId?: string;
  assignedRouteName?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedAttendantId?: string;
  assignedAttendantName?: string;
  purchaseDate: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  permitExpiry: string;
  pollutionExpiry: string;
  lastServiceDate: string;
  nextServiceDue: string;
  odometerKm: number;
  fuelType: 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
  notes?: string;
}

export interface TransportDriver {
  id: string;
  staffId?: string;
  name: string;
  phone: string;
  email: string;
  dutyType: 'driver' | 'attendant';
  licenceNumber?: string;
  licenceClass?: string;     // e.g. "Commercial CDL Class B"
  licenceExpiry?: string;
  status: 'active' | 'on-leave' | 'inactive';
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  medicalFitnessValidUntil?: string;
  backgroundCheckPassed: boolean;
  yearsExperience: number;
  notes?: string;
}

export interface StudentTransportAssignment {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  guardianName: string;
  guardianPhone: string;
  routeId: string;
  routeName: string;
  vehicleNumber: string;
  pickupStopId: string;
  pickupStopName: string;
  morningPickupTime: string;
  dropoffStopId: string;
  dropoffStopName: string;
  afternoonDropTime: string;
  serviceType: TransportServiceType;
  startDate: string;
  status: TransportAssignmentStatus;
  monthlyTransportFee: number;
  feeStatus: TransportFeeStatus;
  notes?: string;
}

export interface TransportBoardingRecord {
  id: string;
  date: string;
  routeId: string;
  routeName: string;
  serviceType: 'morning' | 'afternoon';
  studentId: string;
  studentName: string;
  className: string;
  stopName: string;
  status: BoardingStatus;
  markedAt?: string;
  markedBy?: string;
}

export interface VehicleMaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  maintenanceType: 'Routine Service' | 'Brake Inspection' | 'Tire Replacement' | 'Engine Repair' | 'Safety Inspection' | 'Bodywork';
  serviceDate: string;
  workshopName: string;
  cost: number;
  odometerReading: number;
  description: string;
  partsReplaced?: string;
  nextServiceDueKm: number;
  nextServiceDueDate: string;
  status: MaintenanceStatus;
  invoiceRef?: string;
  approvedBy?: string;
}

export interface TransportExpense {
  id: string;
  date: string;
  category: ExpenseCategory;
  vehicleId?: string;
  vehicleReg?: string;
  amount: number;
  vendor: string;
  description: string;
  receiptRef?: string;
  paymentStatus: 'paid' | 'pending' | 'approved';
  recordedBy: string;
}

export interface TransportIncident {
  id: string;
  date: string;
  time: string;
  vehicleId: string;
  vehicleReg: string;
  routeId: string;
  routeName: string;
  driverName: string;
  category: 'Minor Mechanical Delay' | 'Route Detour / Traffic' | 'Minor Scrape / Collision' | 'Medical / First Aid' | 'Disciplinary / Behavioral' | 'Weather Delay';
  severity: IncidentSeverity;
  description: string;
  affectedStudentsCount: number;
  actionTaken: string;
  followUpRequired: boolean;
  status: IncidentStatus;
  reportedBy: string;
}
