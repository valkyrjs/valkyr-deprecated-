/**
 * PublicIdentity
 *
 * This class is designed to be part of a provider node which is not
 * an independent actor but simply dumb storage of encrypted identities.
 *
 * It provides a list of publicly searchable public identities in which
 * the provider node can initiate an authentication process which
 * releases the data to the authenticated client.
 *
 * The provider does not handle any sort of cryptographic keys, but
 * simply stores and facilitates encrypted data.
 *
 * For consumer nodes see the Private and Public Identity classes.
 *
 * @see {@link PrivateIdentity}
 * @see {@link UserIdentity}
 */
export class PublicIdentity {
  readonly pids: PublicIdentities;
  readonly data: string;

  constructor(props: PublicIdentityProps) {
    this.pids = props.pids;
    this.data = props.data;
  }

  static create(alias: PublicAlias, data: string): PublicIdentity {
    return new PublicIdentity({
      pids: {
        [alias.value]: alias
      },
      data
    });
  }

  toJSON() {
    return {
      pids: this.pids,
      data: this.data
    };
  }
}

type PublicIdentityProps = {
  pids: PublicIdentities;
  data: string;
};

type PublicIdentities = Record<string, PublicAlias>;

type PublicAlias = {
  type: string;
  value: string;
  token?: string;
};
