import { Schema as S } from 'effect'

export const Ss58Address = S.String.pipe(
  S.pattern(/^[1-9A-HJ-NP-Za-km-z]{48}$/),
  S.annotations({
    identifier: 'Ss58Address',
  }),
  S.brand('Ss58Address'),
)
