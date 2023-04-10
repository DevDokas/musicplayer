import { type ReactElement } from 'react';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MyComponent(): ReactElement {
  return <FontAwesomeIcon icon={faCoffee} />;
}
