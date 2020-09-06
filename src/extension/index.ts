//this file is loaded in the extension context

//@ts-ignore
import extensionBrowserCode from "!!raw-loader!../../dist/extension/browser-bundle.js";

const script = document.createElement("script");
script.text = extensionBrowserCode;
(document.head || document.documentElement).appendChild(script);
