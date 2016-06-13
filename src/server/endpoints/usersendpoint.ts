/// <reference path="../../../typings/all.d.ts" />

"use strict";
import { IReport } from "../../shared/actions";
import { CredentialKeys, ICredentials } from "../../shared/login";
import { IUser } from "../../shared/users";
import { ErrorCause, ServerError } from "../errors";
import { Endpoint } from "./endpoint";

/**
 * Mock database storage for users.
 */
export class UsersEndpoint extends Endpoint<IReport<IUser>[]> {
    /**
     * @returns Path to this part of the global api.
     */
    public getRoute(): string {
        return "users";
    }

    /**
     * Retrieves all users.
     * 
     * @param credentials   Login values for authentication.
     * @returns A promise for all users.
     * @remarks A user retrieving their own data should use "user/get".
     */
    public async get(credentials: ICredentials): Promise<IReport<IUser>[]> {
        await this.validateAdminSubmission(credentials);

        return this.collection.find().toArray();
    }

    /**
     * Adds users to the database.
     * 
     * @param credentials   Login values for authentication.
     * @param users   Users to add.
     * @returns A promise for addingthe users.
     */
    public async put(credentials: ICredentials, users: IReport<IUser>[]): Promise<any> {
        await this.validateAdminSubmission(credentials);
        this.validateUserReports(users);

        return this.collection.insertMany(users);
    }

    /**
     * Retrieves multiple users.
     * 
     * @param credentials   Login values for authentication.
     * @param alias   Aliases of users.
     * @returns A promise for the users with the aliases.
     */
    public async getByAliases(credentials: ICredentials, aliases: string[]): Promise<IReport<IUser>[]> {
        const users = await this.collection
            .find({
                "data.alias": {
                    $in: aliases
                }
            })
            .toArray();

        const foundAliases: string[] = users.map(
            (report: IReport<IUser>): string => report.data.alias);

        let aliasMissing: boolean = false;
        for (let i: number = 0; i < aliases.length; i += 1) {
            if (foundAliases.indexOf(aliases[i]) === -1) {
                aliasMissing = true;
                break;
            }
        }

        if (!aliasMissing) {
            return Promise.resolve(users);
        }

        const missing: string[] = users
            .map((user: IReport<IUser>): string => user.data.alias)
            .filter((alias: string): boolean => aliases.indexOf(alias) === -1);

        throw new ServerError(ErrorCause.UsersDoNotExist, missing);
    }

    /**
     * Retrieves a user by their credentials, if they exist.
     * 
     * @param credentials   Login values for authentication.
     * @param alias   Alias of a user.
     * @returns A promise for the user with the alias.
     * @remarks This can't call validateUserSubmission, because that calls this.
     */
    public async getByCredentials(credentials: ICredentials): Promise<IReport<IUser>> {
        await this.validateCredentials(credentials);

        return await this.collection.findOne({
            "data.alias": credentials.alias,
            "data.nickname": credentials.nickname,
            "data.passphrase": credentials.passphrase
        });
    }

    /**
     * Updates a user's information.
     * 
     * @param report   Updated information for a user.
     * @returns A promise for when the user is updated.
     */
    public async update(report: IReport<IUser>): Promise<any> {
        return this.collection.updateOne(
            {
                "data.alias": report.data.alias
            },
            report);
    }

    /**
     * Imports users into the database.
     * 
     * @param users   Users to be imported as administrators.
     * @returns A promise for importing the users.
     */
    public importUsers(users: IUser[]): Promise<any> {
        return this.collection.insertMany(
            users.map(
                (user: IUser): IReport<IUser> => {
                    return {
                        data: {
                            alias: user.alias,
                            alive: true,
                            biography: user.biography,
                            nickname: user.nickname,
                            passphrase: user.passphrase,
                            target: user.target
                        },
                        reporter: "",
                        timestamp: Date.now()
                    };
                }));
    }

    /**
     * Imports users as administrators to the database.
     * 
     * @param users   Users to be imported as administrators.
     * @returns A promise for importing the users.
     */
    public importAdmins(users: IUser[]): Promise<any> {
        return this.collection.insertMany(
            users.map(
                (user: IUser): IReport<IUser> => {
                    return {
                        data: {
                            admin: true,
                            alias: user.alias,
                            alive: true,
                            biography: user.biography,
                            nickname: user.nickname,
                            passphrase: user.passphrase
                        },
                        reporter: "",
                        timestamp: Date.now()
                    };
                }));
    }

    /**
     * Validates that user reports have their required fields.
     * 
     * @param reports   User reports to be added.
     */
    private validateUserReports(reports: IReport<IUser>[]): void {
        reports.forEach((report: IReport<IUser>, i: number): void => {
            if (!report.data) {
                throw new ServerError(ErrorCause.InvalidData, `[${i}].data`);
            }

            CredentialKeys.forEach((key: string): void => {
                if (!report.data[key]) {
                    throw new ServerError(ErrorCause.InvalidData, `[${i}].data[${key}]`);
                }
            });
        });
    }
}