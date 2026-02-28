// Simple deterministic mock for uuid to keep snapshots stable
module.exports = {
  v4: () => "00000000-0000-4000-8000-000000000000"
};
