import { ComponentProps } from 'react';

type LinkProps = ComponentProps<'link'>;
type LinkTypes = 'footer' | 'header' | 'social';

export interface LinkComponentInterface extends LinkProps {
  type?: LinkTypes;
}
