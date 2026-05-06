BEGIN;

-- Remove the unused TA variant from CourseEnrollmentRole.
CREATE TYPE "CourseEnrollmentRole_new" AS ENUM ('STUDENT');

ALTER TABLE "CourseEnrollment"
ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "CourseEnrollment"
ALTER COLUMN "role" TYPE "CourseEnrollmentRole_new"
USING ("role"::text::"CourseEnrollmentRole_new");

ALTER TABLE "CourseEnrollment"
ALTER COLUMN "role" SET DEFAULT 'STUDENT';

DROP TYPE "CourseEnrollmentRole";
ALTER TYPE "CourseEnrollmentRole_new" RENAME TO "CourseEnrollmentRole";

COMMIT;
