import { ParseResult, Schema as S } from 'effect'
import { compact } from 'scale-ts'

export const CompactBrand: unique symbol = Symbol.for('@substrate-sdk/scale-codec/Compact')

export const Compact = S.transformOrFail(
  S.Uint8ArrayFromSelf.pipe(
    S.filter(
      (bytes) => bytes.byteLength > 0 || 'Decoding SCALE compact requires at least 1 byte of input',
    ),
  ),
  S.Union(
    S.Number.pipe(S.int(), S.nonNegative()),
    S.BigIntFromSelf.pipe(S.nonNegativeBigInt()),
  ),
  {
    strict: true,
    decode: (input, _, ast) =>
      ParseResult.try({
        try: () => compact.dec(input),
        catch: () =>
          new ParseResult.Type(
            ast,
            input,
            'Invalid SCALE compact encoding. The input bytes do not represent a valid compact-encoded number',
          ),
      }),
    encode: (input) => ParseResult.succeed(compact.enc(input)),
  },
).pipe(
  S.annotations({
    identifier: 'Compact',
    title: 'SCALE Compact',
    description: 'A compact encoding for numbers in SCALE format, optimized for small values',
    documentation: `
      The Compact type provides an efficient encoding for numbers in SCALE format.
      All values are encoded in little-endian format.
      
      Encoding ranges:
      - Values 0-63 are encoded in a single byte
      - Values 64-16383 are encoded in 2 bytes
      - Values 16384-1073741823 are encoded in 4 bytes
      - Values above 1073741823 are encoded in 5-9 bytes
    `,
    examples: [0, 42, 16384, 1073741824n],
  }),
  S.brand(CompactBrand),
)

export type Compact = S.Schema.Type<typeof Compact>
