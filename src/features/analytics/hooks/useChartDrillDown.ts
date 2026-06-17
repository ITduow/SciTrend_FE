import { useDisclosure } from "../../../shared/hooks/useDisclosure";

export function useChartDrillDown() {
  return useDisclosure(false);
}
