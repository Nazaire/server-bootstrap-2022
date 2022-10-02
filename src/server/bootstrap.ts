import { setupTypeorm } from "@app/setup/setupTypeorm";

export async function bootstrap() {
  setupTypeorm();
}
