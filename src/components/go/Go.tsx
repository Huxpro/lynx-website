import path from 'path';
import { Go as GoBase, GoConfigProvider } from '@lynx-js/go-web';
import type { GoProps } from '@lynx-js/go-web';
import { rspressAdapter } from '@lynx-js/go-web/adapters/rspress';
import { useI18n as useRspressI18n } from '@rspress/core/runtime';
import { ExamplePreview as SSGComponent } from './example-preview-ssg';
import Callout from '../Callout';

const ErrorComponent = ({
  example,
  exampleBaseUrl,
}: {
  example: string;
  exampleBaseUrl: string;
}) => (
  <Callout type="danger" title="Error Loading Example Data">
    <p>
      Error loading Example data for example: <code>{example}</code>
      <br />
      Please check if the file <code>example-metadata.json</code> exists in{' '}
      <code>
        {exampleBaseUrl}/{example}
      </code>{' '}
      .
    </p>
  </Callout>
);

/**
 * Rspress `useI18n` throws when a key is missing from `i18n.json` / the
 * virtual i18n module. go-web ships English defaults for its own keys, so
 * fall back to those (and ultimately the key) instead of crashing the page
 * when a new go-web release adds strings before site i18n is updated.
 */
const GO_I18N_FALLBACK: Record<string, string> = {
  'go.preview': 'Preview',
  'go.qrcode': 'QR Code',
  'go.files': 'Files',
  'go.scan.message-1': 'Scan the QR code with',
  'go.scan.message-2': 'to preview on device.',
  'go.qrcode.copy-link': 'Copy link',
  'go.qrcode.copied': 'Copied!',
  'go.qrcode.entry': 'Entry:',
  'go.openin': 'Open',
  'go.deeplink.open.default': 'Open in Lynx Explorer',
  'go.deeplink.open.lynxtron': 'Open in Lynxtron Go',
  'go.deeplink.open.sparkling': 'Open in Sparkling',
  'go.deeplink.hint-desktop': 'desktop only',
  'go.deeplink.hint-mobile': 'mobile only',
  'go.deeplink.or': 'or',
  'go.openin.show-qrcode': 'Show QR Code',
  'go.ultra': 'Open frameless',
  'go.ultra.exit': 'Exit frameless',
  'go.refresh': 'Refresh',
};

function useGoI18n() {
  const t = useRspressI18n();
  return (key: string) => {
    try {
      // rspress types keys as keyof I18nText; go-web passes plain strings.
      return t(key as never);
    } catch {
      return GO_I18N_FALLBACK[key] ?? key;
    }
  };
}

const config = {
  ...rspressAdapter,
  useI18n: useGoI18n,
  exampleBasePath: '/lynx-examples',
  ssgExampleRoot: path?.join?.(__dirname, '../../docs/public/lynx-examples'),
  explorerUrl: {
    cn:
      process.env.LYNX_EXPLORER_URL_CN ||
      '/zh/guide/start/quick-start.html#download-lynx-explorer,ios-simulator-platform=macos-arm64,explorer-platform=ios-simulator',
    en:
      process.env.LYNX_EXPLORER_URL_EN ||
      '/guide/start/quick-start.html#download-lynx-explorer,ios-simulator-platform=macos-arm64,explorer-platform=ios-simulator',
  },
  explorerText: process.env.LYNX_EXPLORER_TEXT || 'Lynx Explorer',
  ErrorComponent,
  SSGComponent,
};

export function Go(props: GoProps) {
  return (
    <GoConfigProvider config={config}>
      <GoBase {...props} />
    </GoConfigProvider>
  );
}

export type { GoProps };
export default Go;
