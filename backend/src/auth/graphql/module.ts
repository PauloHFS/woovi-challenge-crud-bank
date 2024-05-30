import { createModule, gql } from 'graphql-modules';
import {
  createNewUser,
  getUserByTaxId,
  updateUserHashedPassword,
} from '../services';
import { checkPassword, createJWTToken } from '../utils';

export const authModule = createModule({
  id: 'auth',
  dirname: __dirname,
  typeDefs: [
    gql`
      input SignUpData {
        first_name: String!
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
      signup: async (_root: any, args: any) => {
        console.log(args);

        const { user, error } = await createNewUser({
          first_name: args?.data?.first_name,
          tax_id: args?.data?.tax_id,
          password: args?.data?.password,
        });

        if (error || user == undefined) {
          return {
            error: error ?? 'Não foi possivel cadastrar o usuário',
          };
        }

        const { token, error: JWTError } = await createJWTToken({
          _id: user._id,
          tax_id: user.tax_id,
          first_name: user.first_name,
        });

        if (JWTError || token == undefined) {
          return {
            error: 'Cannot generate the access_token',
          };
        }

        return {
          access_token: token,
          type: 'Bearer',
        };
      },
      signin: async (_root: {}, args: any) => {
        const { user, error } = await getUserByTaxId(args?.data?.tax_id);

        if (error || user == undefined || user == null) {
          return {
            error: error ?? 'usuário não encontrado',
          };
        }

        const {
          error: checkPasswordError,
          isOk,
          new_hash,
        } = await checkPassword(user.hashed_password, args?.data?.password);

        if (checkPasswordError && isOk == undefined) {
          return {
            error: checkPasswordError,
          };
        }

        if (new_hash) {
          const { error } = await updateUserHashedPassword({
            tax_id: args?.data?.tax_id as string,
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
