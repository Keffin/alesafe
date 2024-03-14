import { FileDetector } from "./detector/FileDetector";
import { MasterPassword } from "./MasterPassword";

const fd: FileDetector = new FileDetector();
const m = new MasterPassword({ hash: "", salt: "", iterationCount: 1 }, fd);

m.handle();
