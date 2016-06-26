"use strict";

import { ICredentials } from "./login";

/**
 * Public leaderboard information on a user.
 */
export interface ILeader {
    /**
     * Whether the user is still alive.
     */
    alive: boolean;

    /**
     * How many kills the user has accomplished.
     */
    kills: number;

    /**
     * A unique friendly codename of the user.
     */
    codename: string;
}

/**
 * Database model representation of a user.
 */
export interface IUser extends ICredentials, ILeader {
    /**
     * Whether this user is an administrator.
     */
    admin?: boolean;

    /**
     * Whether the user is currently alive.
     */
    alive: boolean;

    /**
     * Who this person is hunting, if still alive.
     */
    target?: string;
}
