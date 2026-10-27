ALTER TABLE complaints
ADD COLUMN assigned_to UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_complaints_assigned_to
ON complaints(assigned_to);