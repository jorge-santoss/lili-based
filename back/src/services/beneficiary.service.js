// services/beneficiary.service.js
import db from "../config/database.js";

async function createBeneficiary({
  associationId,
  firstName,
  lastName,
  email,
  phone,
  birthYear,
  rgpdAccepted,
}) {
  const stmt = db.prepare(`
    INSERT INTO beneficiaries (
      association_id,
      first_name,
      last_name,
      email,
      phone,
      birth_year,
      rgpd_accepted
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.run(
    associationId,
    firstName,
    lastName,
    email,
    phone ?? null,
    birthYear ?? null,
    rgpdAccepted ? 1 : 0
  );

  return await db
    .prepare("SELECT * FROM beneficiaries WHERE id = ?")
    .get(result.lastInsertRowid);
}

async function getBeneficiariesForAssociation(associationId) {
  const stmt = db.prepare(`
    SELECT *
    FROM beneficiaries
    WHERE association_id = ?
    ORDER BY last_name ASC, first_name ASC
  `);
  return await stmt.all(associationId);
}

async function getBeneficiaryById(id) {
  return await db
    .prepare("SELECT * FROM beneficiaries WHERE id = ?")
    .get(id);
}

export default {
  createBeneficiary,
  getBeneficiariesForAssociation,
  getBeneficiaryById,
};
