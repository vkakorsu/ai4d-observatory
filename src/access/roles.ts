import type { Access, FieldAccess } from 'payload'

/**
 * Roles (Section 3.1.3 c of the RFP).
 * admin        everything, including users and settings
 * editor       create, edit, publish, unpublish, archive content and taxonomies. Export records.
 * contributor  create and edit drafts only
 */
export type Role = 'admin' | 'editor' | 'contributor'

type UserLike = { role?: Role | null } | null | undefined

export const hasRole = (user: UserLike, ...roles: Role[]) =>
  Boolean(user && user.role && roles.includes(user.role))

export const isAdmin: Access = ({ req }) => hasRole(req.user as UserLike, 'admin')
export const isEditor: Access = ({ req }) => hasRole(req.user as UserLike, 'admin', 'editor')
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Public sees published documents. Staff see everything, including drafts. */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Contributors can create and update, but may not publish. Enforced by `contributorsCannotPublish` in fields/shared.ts. */
export const staffCanWrite: Access = ({ req }) =>
  hasRole(req.user as UserLike, 'admin', 'editor', 'contributor')

export const adminFieldOnly: FieldAccess = ({ req }) => hasRole(req.user as UserLike, 'admin')
export const editorFieldOnly: FieldAccess = ({ req }) =>
  hasRole(req.user as UserLike, 'admin', 'editor')
