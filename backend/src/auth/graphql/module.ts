import { createModule, gql } from 'graphql-modules';
import { getUserByTaxId, updateUserHashedPassword } from '../services';
import { checkPassword, createJWTToken } from '../utils';

export const authModule = createModule({
  id: 'auth',
  dirname: __dirname,
  typeDefs: [
    gql`
      input SignUpData {
        tax_id: String!
        password: String!
      }

      input SignInData {
        tax_id: String!
        password: String!
      }

      type AuthResponse {
        access_token: String
        type: String
        error: String
      }

      type Query {
        me: String!
      }

      type Mutation {
        signin(data: SignInData): AuthResponse
        signup(data: SignUpData): AuthResponse
      }
    `,
  ],
  resolvers: {
    Query: {
      me: () => 'me',
    },
    Mutation: {
      signup: async (_root: any, _args: any) => {
        console.log(_args);

        return {
          access_token: '123',
          type: 'Bearer',
        };
      },
      signin: async (_root: {}, _args: any) => {
        const { user, error } = await getUserByTaxId(_args?.data?.tax_id);

        if (error || user == undefined || user == null) {
          return {
            error: error ?? 'usuário não encontrado',
          };
        }

        const {
          error: checkPasswordError,
          isOk,
          new_hash,
        } = await checkPassword(user.hashed_password, _args?.data?.password);

        if (checkPasswordError && isOk == undefined) {
          return {
            error: checkPasswordError,
          };
        }

        if (new_hash) {
          const { error } = await updateUserHashedPassword({
            tax_id: _args?.data?.tax_id as string,
            hashed_password: new_hash,
          });

          if (error) {
            console.log('Error ao atualizar hash do usuário: ' + error);
          }
        }

        if (isOk) {
          const { token, error } = await createJWTToken({
            _id: user._id,
            tax_id: user.tax_id,
            first_name: user.first_name,
          });

          if (error || token == undefined) {
            return {
              error: 'Cannot generate the access_token',
            };
          }

          return {
            access_token: token,
            type: 'Bearer',
          };
        }

        return {
          error: 'tax_id and password are not valid!',
        };
      },
    },
  },
});
