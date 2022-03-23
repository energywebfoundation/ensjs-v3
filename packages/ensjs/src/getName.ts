import { ethers } from 'ethers'
import { ENSArgs } from '.'
import { hexEncodeName } from './utils/hexEncodedName'

export default async function (
  { contracts }: ENSArgs<'contracts'>,
  address: string,
) {
  const universalResolver = await contracts?.getUniversalResolver()

  const reverseNode = address.toLowerCase().substring(2) + '.addr.reverse'

  try {
    const result = await universalResolver?.reverse(
      hexEncodeName(reverseNode),
      [
        {
          sig: 'addr(bytes32)',
          data: [],
        },
      ],
    )

    const [addr] = ethers.utils.defaultAbiCoder.decode(
      ['address'],
      result['1'][0],
    )

    return {
      name: result['0'],
      match: addr.toLowerCase() === address.toLowerCase(),
    }
  } catch {
    return { name: null, match: false }
  }
}
