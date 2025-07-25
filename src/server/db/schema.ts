import { relations, sql } from "drizzle-orm";
import {
  index,
  mysqlTableCreator,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import type { AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `justbookit_${name}`);

export const Categories = {
  TENNIS: "tennis",
  // BADMINTON: "badminton",
  // BASKETBALL: "basketball",
  // VOLLEYBALL: "volleyball",
  FOOTBALL: "football",
} as const;

export const MatchTypes = {
  SINGLES: "singles",
  DOUBLES: "doubles",
  TEAM: "team",
} as const;

export const Preferences = {
  TENNIS: "tennis",
  // BADMINTON: "badminton",
  // BASKETBALL: "basketball",
  // VOLLEYBALL: "volleyball",
  // FOOTBALL: "football",
  CONTACT: "contact",
} as const;

export type Category = (typeof Categories)[keyof typeof Categories];
export type MatchType = (typeof MatchTypes)[keyof typeof MatchTypes];
export type Preference = (typeof Preferences)[keyof typeof Preferences];

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      fsp: 3,
    })
    .default(sql`CURRENT_TIMESTAMP(3)`),
  image: d.varchar({ length: 255 }),
  contactMethod: d.varchar({ length: 255 }).notNull().default("email"),
  contactWhatsAppId: d.varchar({ length: 255 }),
  contactLineId: d.varchar({ length: 255 }),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d.varchar({ length: 255 }).notNull(),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.int(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
    index("accounts_user_id_idx").on(account.userId),
  ]
);

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date" }).notNull(),
  }),
  (session) => [index("session_user_id_idx").on(session.userId)]
);

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date" }).notNull(),
  }),
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

export const venueMembers = createTable(
  "venue_member",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d.varchar({ length: 255 }).notNull(),

    category: d
      .mysqlEnum(Object.values(Categories) as [string, ...string[]])
      .notNull()
      .default(Categories.TENNIS),

    playerId: d.varchar({ length: 255 }).notNull(),
    playerName: d.varchar({ length: 255 }).notNull(),
    playerContactMethod: d.varchar({ length: 50 }).notNull(),
    playerContactId: d.varchar({ length: 255 }).notNull(),
    playerEmailId: d.varchar({ length: 255 }).notNull(),

    venueId: d.varchar({ length: 255 }).notNull(),
    venueName: d.varchar({ length: 255 }).notNull(),
    venueCountry: d.varchar({ length: 255 }).notNull(),

    status: d.varchar({ length: 10 }).notNull().default("active"), // active, inactive, etc.
    joinedAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    leftAt: d.timestamp(),

    createdById: d.varchar({ length: 255 }).notNull(),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (pv) => [
    index("player_venues_player_id_idx").on(pv.playerId),
    index("player_venues_venue_id_idx").on(pv.venueId),
    index("player_venues_status_idx").on(pv.status),
    uniqueIndex("player_venues_player_venue_unique").on(
      pv.playerId,
      pv.venueId
    ),
  ]
);

export const preferences = createTable(
  "preferences",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d.varchar({ length: 255 }).notNull().unique(),
    category: d
      .mysqlEnum([
        "tennis",
        "badminton",
        "basketball",
        "volleyball",
        "football",
        "contact",
      ])
      .notNull(),
    universalTennisRating: d.varchar({ length: 5 }).notNull(),
    nationalTennisRatingProgram: d.varchar({ length: 3 }).notNull(),

    createdById: d.varchar({ length: 255 }).notNull(),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (p) => [index("preferences_user_id_idx").on(p.userId)]
);

export const groups = createTable("group", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  competitionId: d.varchar({ length: 255 }).notNull(),
  name: d.varchar({ length: 255 }).notNull(),
  category: d
    .mysqlEnum([
      "tennis",
      "badminton",
      "basketball",
      "volleyball",
      "football",
      "contact",
    ])
    .notNull(),
  matchType: d
    .mysqlEnum(Object.values(MatchTypes) as [string, ...string[]])
    .notNull()
    .default(MatchTypes.SINGLES),
  description: d.varchar({ length: 255 }),

  createdById: d.varchar({ length: 255 }).notNull(),
  createdAt: d
    .timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp().onUpdateNow(),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(groupMembers),
  venues: many(groupVenues),
}));

export const groupVenues = createTable("group_venue", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: d.varchar({ length: 255 }).notNull(),
  venueId: d.varchar({ length: 255 }).notNull(),
  venueName: d.varchar({ length: 255 }).notNull(),
  venueCountry: d.varchar({ length: 255 }).notNull(),

  createdById: d.varchar({ length: 255 }).notNull(),
  createdAt: d
    .timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp().onUpdateNow(),
}));

export const groupVenuesRelations = relations(groupVenues, ({ one }) => ({
  group: one(groups, {
    fields: [groupVenues.groupId],
    references: [groups.id],
  }),
}));

export const groupMembers = createTable("group_member", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupId: d.varchar({ length: 255 }).notNull(),
  userId: d.varchar({ length: 255 }).notNull(),
  role: d.mysqlEnum(["admin", "member"]).notNull(),

  createdById: d.varchar({ length: 255 }).notNull(),
  createdAt: d
    .timestamp()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp().onUpdateNow(),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  preferences: many(preferences),
  groups: many(groups),
  groupMembers: many(groupMembers),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const preferencesRelations = relations(preferences, ({ one }) => ({
  user: one(users, { fields: [preferences.userId], references: [users.id] }),
}));
