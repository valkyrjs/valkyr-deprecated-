import { AccessAttributes } from "../../src/Lib/AccessAttributes";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

const PRESCRIPTION_FLAGS = {
  type: 1 << 0,
  amount: 1 << 2
};

type PrescriptionFilters = {
  patient: number;
  doctor: number;
};

const medications: Record<"ibuprofen" | "cephalexin", PrescriptionFilters> = {
  ibuprofen: {
    patient: PRESCRIPTION_FLAGS.type,
    doctor: PRESCRIPTION_FLAGS.type | PRESCRIPTION_FLAGS.amount
  },
  cephalexin: {
    patient: PRESCRIPTION_FLAGS.type,
    doctor: PRESCRIPTION_FLAGS.type | PRESCRIPTION_FLAGS.amount
  }
};

/*
 |--------------------------------------------------------------------------------
 | Access Profile
 |--------------------------------------------------------------------------------
 */

export class PrescriptionAccessAttributes extends AccessAttributes<typeof PRESCRIPTION_FLAGS, PrescriptionFilters> {
  constructor(filters: PrescriptionFilters) {
    super(PRESCRIPTION_FLAGS, { ...filters });
  }

  public static for(medication: keyof typeof medications) {
    const filters = medications[medication];
    if (!filters) {
      throw new Error(
        `PrescriptionAccessAttributes Violation: Prescription for medication ${medication} has no valid access attribute filters.`
      );
    }
    return new PrescriptionAccessAttributes(filters);
  }
}
