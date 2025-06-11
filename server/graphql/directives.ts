import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';
import { GraphQLContext } from './context';

export function authDirectiveTransformer(schema: GraphQLSchema) {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

			if (authDirective) {
				const { resolve } = fieldConfig;
				fieldConfig.resolve = async (
					source,
					args,
					context: GraphQLContext,
					info
				) => {
					if (!context.user) {
						throw new Error('Authentication required');
					}

					// If there's a role requirement
					if (authDirective.role && context.user.role !== authDirective.role) {
						throw new Error(`Role ${authDirective.role} required`);
					}

					return resolve?.(source, args, context, info);
				};
			}

			return fieldConfig;
		},
	});
}

// Directive definitions
export const directiveDefinitions = `
  directive @auth(role: String) on FIELD_DEFINITION
`;
