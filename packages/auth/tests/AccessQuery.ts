import { AccessPermission } from "../src/Lib/AccessPermission";
import { AccessQuery } from "../src/Lib/AccessQuery";
import { Query } from "../src/Types/Query";
import { PrescriptionAccessAttributes } from "./mocks/PrescriptionAccessAttributes";

/*
 |--------------------------------------------------------------------------------
 | Mock
 |--------------------------------------------------------------------------------
 */

type Permissions = {
  prescription: {
    read: boolean;
    prescribe: false | Partial<Record<Prescription["type"], number>>;
  };
};

type Prescription = {
  type: Medication;
  amount: number;
  doctor: string;
};

type Medication = "ibuprofen" | "cephalexin";

const doctor = new AccessQuery<Permissions>({
  prescription: {
    read: true,
    prescribe: {
      ibuprofen: 100
    }
  }
});

const patient = new AccessQuery<Permissions>({
  prescription: {
    read: true,
    prescribe: false
  }
});

/*
 |--------------------------------------------------------------------------------
 | Custom Handler
 |--------------------------------------------------------------------------------
 */

const createPrescription: Query<Pick<Prescription, "type" | "amount">, Permissions["prescription"]["prescribe"]> = ({
  type,
  amount
}) => {
  return (prescribe) => {
    if (prescribe === false) {
      return new AccessPermission({
        granted: false,
        message: "You are not eligible to prescribe medicine."
      });
    }
    const dosage = prescribe[type];
    if (!dosage) {
      return new AccessPermission({
        granted: false,
        message: `You are not eligible to prescribe ${type}.`
      });
    }
    if (amount > dosage) {
      return new AccessPermission({
        granted: false,
        message: `Prescribed ${amount} of ${type} exceeds the allowed amount of ${dosage}.`
      });
    }
    return new AccessPermission({
      granted: true,
      attributes: PrescriptionAccessAttributes.for(type)
    });
  };
};

const readPrescription: Query<Prescription["type"], Permissions["prescription"]["read"]> = (type: Prescription["type"]) => {
  return (granted) => new AccessPermission({ granted, attributes: PrescriptionAccessAttributes.for(type) });
};

/*
 |--------------------------------------------------------------------------------
 | Unit Tests
 |--------------------------------------------------------------------------------
 */

describe("AccessQuery", () => {
  describe("when providing action handler", () => {
    it("should allow prescribing ibuprofen 80", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = doctor.can("prescribe", "prescription", createPrescription(prescription));

      expect(permission.granted).toBeTruthy();
    });

    it("should deny prescribing cephalexin", () => {
      const prescription: Prescription = { type: "cephalexin", amount: 100, doctor: "John Doe" };
      const permission = doctor.can("prescribe", "prescription", createPrescription(prescription));

      expect(permission.granted).toBeFalsy();
      expect(permission.message).toEqual("You are not eligible to prescribe cephalexin.");
    });

    it("should deny prescribing ibuprofen 120", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 120, doctor: "John Doe" };
      const permission = doctor.can("prescribe", "prescription", createPrescription(prescription));

      expect(permission.granted).toBeFalsy();
      expect(permission.message).toEqual("Prescribed 120 of ibuprofen exceeds the allowed amount of 100.");
    });

    it("should default to allowing $all when no filter key is provided", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = patient.can("read", "prescription", readPrescription("ibuprofen"));

      expect(permission.granted).toBeTruthy();
      expect(permission.filter(prescription)).toEqual({ type: "ibuprofen", amount: 80, doctor: "John Doe" });
    });

    it("should filter out prescription amount when accessing as patient", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = patient.can("read", "prescription", readPrescription("ibuprofen"));

      expect(permission.granted).toBeTruthy();
      expect(permission.filter(prescription, "patient")).toEqual({ type: "ibuprofen", doctor: "John Doe" });
    });

    it("should filter nothing when accessing as doctor", () => {
      const prescription: Prescription = { type: "ibuprofen", amount: 80, doctor: "John Doe" };
      const permission = patient.can("read", "prescription", readPrescription("ibuprofen"));

      expect(permission.granted).toBeTruthy();
      expect(permission.filter(prescription, "doctor")).toEqual({ type: "ibuprofen", amount: 80, doctor: "John Doe" });
    });
  });
});
