import { authModule } from '@/auth/graphql/module';
import { createApplication } from 'graphql-modules';
import { coreModule } from './core/graphql/module';

export const application = createApplication({
  modules: [authModule, coreModule],
});
