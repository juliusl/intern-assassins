/// <reference path="../../../../../typings/react/index.d.ts" />
/// <reference path="../../../../../typings/react-dom/index.d.ts" />

"use strict";
import * as React from "react";
import { IKillClaim } from "../../../../shared/kills";
import { IAppUserProps } from "../apps/appuser";
import { Actions } from "./actions";
import { Greeting } from "./greeting";
import { InfoDisplay } from "./infodisplay";
import { KillClaimReports } from "./killclaimreports";

/**
 * Component for a user's profile page.
 */
export class Profile extends React.Component<IAppUserProps, void> {
    /**
     * Renders the component.
     * 
     * @returns The rendered component.
     */
    public render(): JSX.Element {
        if (!this.props.user) {
            return (
                <section id="profile" className="loading">
                    loading profile...
                </section>);
        }

        if (!this.props.user.nickname) {
            return (
                <section id="profile" className="loading">
                    loading profile for {this.props.user.nickname}...
                </section>);
        }

        return (
            <section id="profile">
                <div className="area greeting-area">
                    <Greeting admin={this.props.user.admin} nickname={this.props.user.nickname} />
                </div>

                <div className="area info-display-area">
                    <InfoDisplay info="biography" display={this.props.user.biography} editable={true} large={true} />
                    <InfoDisplay info="nickname" display={this.props.user.nickname} editable={true} />
                    <InfoDisplay info="target" display={this.props.user.target} />
                </div>

                <div class="area">
                    <Actions
                        alive={this.props.user.alive}
                        onDeath={(): void => { this.onDeath(); }}
                        onKill={(): void => { this.onKill(); }} />
                </div>

                {this.renderKillClaimReports(this.props.killClaims)}
            </section>);
    }

    /**
     * Renders the user's active kill claim reports, if there are any.
     * 
     * @param The user's relevant kill claim reports.
     * @returns The rendered kill claim reports.
     */
    private renderKillClaimReports(killClaims: IKillClaim[]): JSX.Element {
        if (!killClaims || !killClaims.length) {
            return undefined;
        }

        return <KillClaimReports killClaims={killClaims} />;
    }

    /**
     * Handler for the user reporting their own death.
     * 
     * @returns A promise for the report completing.
     */
    private async onDeath(): Promise<void> {
        await this.props.sdk.reportKillClaim(
            this.props.user,
            {
                killer: this.props.user.alias,
                victim: this.props.user.alias
            });

        this.props.refreshUserData();
    }

    /**
     * Handler for the user reporting they've scored a kill.
     * 
     * @returns A promise for the report completing.
     */
    private async onKill(): Promise<void> {
        await this.props.sdk.reportKillClaim(
            this.props.user,
            {
                killer: this.props.user.alias,
                victim: this.props.user.target
            });

        this.props.refreshUserData();
    }
}
