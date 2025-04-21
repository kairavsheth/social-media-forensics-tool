// app/dashboard/components/ForensicFindings.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Shield, FileText, MapPin, Hash, AtSign, Link, UserCheck, Clock } from "lucide-react";
import {BasicUserInfo, ProfileAnalysisResult} from "@/lib/types";

interface ForensicFindingsProps {
    forensicData: ProfileAnalysisResult;
    instagramData: BasicUserInfo;
}

export default function ForensicFindings({ forensicData }: ForensicFindingsProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Authenticity</CardTitle>
                    <CardDescription>Assessment of account legitimacy</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Assessment</AlertTitle>
                        <AlertDescription>
                            {forensicData.account_authenticity.assessment}
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Positive Indicators
                            </h3>
                            {forensicData.account_authenticity.indicators.positive.length > 0 ? (
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {forensicData.account_authenticity.indicators.positive.map((indicator, index) => (
                                        <li key={index}>{indicator}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No positive indicators identified</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                Negative Indicators
                            </h3>
                            {forensicData.account_authenticity.indicators.negative.length > 0 ? (
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {forensicData.account_authenticity.indicators.negative.map((indicator, index) => (
                                        <li key={index}>{indicator}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No negative indicators identified</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                                Recommendations
                            </h3>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {forensicData.account_authenticity.recommendations.map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Location Analysis</CardTitle>
                    <CardDescription>Identified and inferred locations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Explicitly Mentioned Locations
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.forensic_analysis.mentioned_locations.map((location, index) => (
                                    <Badge key={index} variant="outline">{location}</Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Inferred Locations
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.inferred_analysis.potential_locations.map((location, index) => (
                                    <Badge key={index} variant="outline">{location.location}</Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Language Analysis
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.forensic_analysis.language_notes}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Keywords and Entities</CardTitle>
                    <CardDescription>Key terms and entities identified</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Keywords of Interest</h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.forensic_analysis.keywords_of_interest.map((keyword, index) => (
                                    <Badge key={index} variant="outline">{keyword}</Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Persons</h3>
                                <div className="flex flex-wrap gap-2">
                                    {forensicData.entity_extraction.persons.map((person, index) => (
                                        <Badge key={index} variant="outline">{person}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Organizations</h3>
                                {forensicData.entity_extraction.organizations.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {forensicData.entity_extraction.organizations.map((org, index) => (
                                            <Badge key={index} variant="outline">{org}</Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No organizations detected</p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium mb-2">Technologies/Tools</h3>
                                <div className="flex flex-wrap gap-2">
                                    {forensicData.entity_extraction.technologies_tools.map((tool, index) => (
                                        <Badge key={index} variant="outline">{tool}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Projects/Products</h3>
                                {forensicData.entity_extraction.projects_products.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {forensicData.entity_extraction.projects_products.map((product, index) => (
                                            <Badge key={index} variant="outline">{product}</Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No projects or products detected</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Connections</CardTitle>
                    <CardDescription>Network and external connections</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <AtSign className="h-4 w-4 mr-2" />
                                Mentioned Usernames
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.forensic_analysis.external_connections.usernames.map((username, index) => (
                                    <Badge key={index} variant="outline">{username}</Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Link className="h-4 w-4 mr-2" />
                                External URLs
                            </h3>
                            {forensicData.forensic_analysis.external_connections.urls.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {forensicData.forensic_analysis.external_connections.urls.map((url, index) => (
                                        <Badge key={index} variant="outline">{url}</Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No external URLs detected</p>
                            )}
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Hash className="h-4 w-4 mr-2" />
                                Hashtags Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.entity_extraction.hashtags.map((hashtag, index) => (
                                    <Badge key={index} variant="outline">#{hashtag}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Temporal Analysis</CardTitle>
                    <CardDescription>Posting patterns and frequency</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Posting Frequency
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.temporal_analysis?.posting_frequency.summary ?? "Frequency data not available"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2">Time of Day Patterns</h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.temporal_analysis?.time_of_day_patterns.summary ?? "Patterns data not available"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2">Account Evolution</h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.temporal_analysis?.evolution_over_time ?? "Evolution data not available"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <UserCheck className="h-4 w-4 mr-2" />
                                Automated vs. Human Assessment
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {forensicData.content_analysis?.automated_vs_human.assessment ?? "Assessment not available"}
                            </p>
                            {forensicData.content_analysis?.automated_vs_human.indicators.length != 0 && (
                                <div className="mt-2">
                                    <h4 className="text-xs font-medium mb-1">Indicators:</h4>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        {forensicData.content_analysis?.automated_vs_human.indicators.map((indicator, index) => (
                                            <li key={index}>{indicator}</li>
                                        )) ?? "No indicators available"}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>PII Detection</CardTitle>
                    <CardDescription>Personally identifiable information detected</CardDescription>
                </CardHeader>
                <CardContent>
                    {forensicData.forensic_analysis.pii_indicators.length > 0 ? (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium mb-2">Detected PII</h3>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {forensicData.forensic_analysis.pii_indicators.map((indicator, index) => (
                                    <li key={index}>{indicator}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>No PII Detected</AlertTitle>
                            <AlertDescription>
                                No personally identifiable information was detected in the analyzed content.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}