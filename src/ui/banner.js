import { c, gradients } from './colors.js';
import { createBox } from './box.js';

export const ASCII_LOGO = `
  ██████╗██╗     ██╗██╗   ██╗██╗██████╗ ███████╗
 ██╔════╝██║     ██║██║   ██║██║██╔══██╗██╔════╝
 ██║     ██║     ██║██║   ██║██║██████╔╝█████╗  
 ██║     ██║     ██║╚██╗ ██╔╝██║██╔══██╗██╔══╝  
 ╚██████╗███████╗██║ ╚████╔╝ ██║██████╔╝███████╗
  ╚═════╝╚══════╝╚═╝  ╚═══╝  ╚═╝╚═════╝ ╚══════╝
`;

export function showBanner() {
  console.log(gradients.synthwave(ASCII_LOGO.trim()));
  console.log(
    c.bold.hex('#8892b0')('  ⚡ The Zero-Dependency Developer Cockpit & Swiss-Army CLI') +
    c.hex('#5271FF')(' [v1.0.0]\n')
  );
}

export { createBox };
