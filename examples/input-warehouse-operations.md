# Warehouse Operations Requirements

Support core packing-station workflows for warehouse staff.

Users must be able to:
- print a shipping label for a packed order
- reprint a label if the first print fails
- mark an order as packed once the package is sealed

Additional constraints:
- only authorized warehouse staff can perform these actions
- audit events must be recorded for printing and reprinting labels
- the packing station should continue to work if the printer briefly disconnects
