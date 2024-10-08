export class HandyUtils {
  private static internalSignature = ['node:internal', 'ext:'];
  private static packageSignatures = [
    'node_modules',
    'registry.npm.org',
    'jsr.io',
    'https://',
  ];

  static isInternalTrace(line: string): boolean {
    for (const signature of this.internalSignature) {
      if (line.includes(signature)) return true;
    }

    return false;
  }

  static isPackageTrace(line: string, customSignatures?: string[]): boolean {
    if (customSignatures?.length)
      for (const signature of customSignatures) {
        if (line.includes(signature)) return true;
      }

    for (const signature of this.packageSignatures) {
      if (line.includes(signature)) return true;
    }

    return false;
  }
}
