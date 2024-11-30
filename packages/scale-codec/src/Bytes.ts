import { concat as bytesConcat } from '@substrate-sdk/bytes'
import { Either, ParseResult, Schema as S } from 'effect'
import { Compact } from './Compact.js'

export const BytesBrand: unique symbol = Symbol.for('@substrate-sdk/scale-codec/Bytes')

export const Bytes = S.transformOrFail(
  S.Uint8ArrayFromSelf,
  S.Uint8ArrayFromSelf,
  {
    strict: true,
    decode: (input, options, ast) => {
      const decodeLen = ParseResult.decodeEither(Compact.pipe(S.filter((n) => typeof n === 'number')), options)
      const lenResult = decodeLen(input)
      if (Either.isLeft(lenResult)) {
        return ParseResult.fail(lenResult.left)
      }
      const len = lenResult.right

      const prefixByteLength = ParseResult.encodeSync(Compact, options)(len).byteLength
      const remainingBytes = input.byteLength - (input.byteOffset + prefixByteLength)

      if (remainingBytes < len) {
        return ParseResult.fail(
          new ParseResult.Type(
            ast,
            input,
            `Invalid Bytes: expected ${len} bytes but only ${remainingBytes} remaining`,
          ),
        )
      }

      return ParseResult.succeed(new Uint8Array(input.buffer, input.byteOffset + prefixByteLength, len))
    },
    encode: (input, options) => {
      const len = ParseResult.encodeUnknownSync(Compact, options)(input.byteLength)
      return ParseResult.succeed(bytesConcat([len, input]))
    },
  },
).pipe(
  S.annotations({
    identifier: 'Bytes',
    title: 'SCALE Bytes',
    description: 'A length-prefixed byte array in SCALE format',
    documentation: `
      The Bytes type represents a variable-length byte array in SCALE format.
      It is encoded as:
      - A compact-encoded length prefix
      - Followed by the actual bytes
      
      This is commonly used for representing arbitrary binary data in SCALE format.
    `,
    examples: [
      new Uint8Array([12, 1, 2, 3]),
      new Uint8Array([12, 0, 1, 2]),
    ],
  }),
  S.brand(BytesBrand),
)

export type Bytes = S.Schema.Type<typeof Bytes>
