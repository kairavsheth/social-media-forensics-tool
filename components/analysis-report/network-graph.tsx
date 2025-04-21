// app/dashboard/components/NetworkGraph.tsx
"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as d3 from "d3";
import {BasicUserInfo, ProfileAnalysisResult} from "@/lib/types";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Separator} from "@/components/ui/separator";

interface NetworkGraphProps {
    forensicData: ProfileAnalysisResult;
    instagramData: BasicUserInfo;
}

export default function NetworkGraph({ forensicData  }: NetworkGraphProps) {
    const graphRef = useRef<SVGSVGElement>(null);

    // useEffect(() => {
    //     if (!graphRef.current || !forensicData.network_graph_data.nodes.length) return;
    //
    //     // Clear previous content
    //     d3.select(graphRef.current).selectAll("*").remove();
    //
    //     const width = graphRef.current.clientWidth;
    //     const height = 400;
    //
    //     const svg = d3.select(graphRef.current)
    //         .attr("width", width)
    //         .attr("height", height);
    //
    //     // Create a force simulation
    //     const simulation = d3.forceSimulation(forensicData.network_graph_data.nodes as any)
    //         .force("link", d3.forceLink(forensicData.network_graph_data.edges as any)
    //             .id((d: any) => d.id)
    //             .distance(100))
    //         .force("charge", d3.forceManyBody().strength(-300))
    //         .force("center", d3.forceCenter(width / 2, height / 2));
    //
    //     // Create links
    //     const links = svg.append("g")
    //         .selectAll("line")
    //         .data(forensicData.network_graph_data.edges)
    //         .enter()
    //         .append("line")
    //         .attr("stroke", "#999")
    //         .attr("stroke-opacity", 0.6)
    //         .attr("stroke-width", 2);
    //
    //     // Create nodes
    //     const nodes = svg.append("g")
    //         .selectAll("g")
    //         .data(forensicData.network_graph_data.nodes)
    //         .enter()
    //         .append("g")
    //         .call(d3.drag()
    //             .on("start", dragstarted)
    //             .on("drag", dragged)
    //             .on("end", dragended) as any);
    //
    //     // Add circles to nodes
    //     nodes.append("circle")
    //         .attr("r", (d: any) => d.type === "ProfileOwner" ? 20 : 15)
    //         .attr("fill", (d: any) => d.type === "ProfileOwner" ? "#4f46e5" : "#10b981")
    //         .attr("stroke", "#fff")
    //         .attr("stroke-width", 2);
    //
    //     // Add labels to nodes
    //     nodes.append("text")
    //         .attr("dx", 0)
    //         .attr("dy", 30)
    //         .attr("text-anchor", "middle")
    //         .text((d: any) => d.label)
    //         .attr("font-size", "10px");
    //
    //     // Add relation labels to edges
    //     svg.append("g")
    //         .selectAll("text")
    //         .data(forensicData.network_graph_data.edges)
    //         .enter()
    //         .append("text")
    //         .attr("text-anchor", "middle")
    //         .attr("dy", -5)
    //         .attr("font-size", "8px")
    //         .text((d: any) => d.relation);
    //
    //     // Update positions
    //     simulation.on("tick", () => {
    //         links
    //             .attr("x1", (d: any) => d.source.x)
    //             .attr("y1", (d: any) => d.source.y)
    //             .attr("x2", (d: any) => d.target.x)
    //             .attr("y2", (d: any) => d.target.y);
    //
    //         nodes.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    //
    //         svg.selectAll("g > text")
    //             .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
    //             .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
    //     });
    //
    //     function dragstarted(event: any, d: any) {
    //         if (!event.active) simulation.alphaTarget(0.3).restart();
    //         d.fx = d.x;
    //         d.fy = d.y;
    //     }
    //
    //     function dragged(event: any, d: any) {
    //         d.fx = event.x;
    //         d.fy = event.y;
    //     }
    //
    //     function dragended(event: any, d: any) {
    //         if (!event.active) simulation.alphaTarget(0);
    //         d.fx = null;
    //         d.fy = null;
    //     }
    // }, [forensicData]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Network Connections</CardTitle>
                        <CardDescription>Visualized connections between entities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-96 border rounded-lg overflow-hidden">
                            <svg ref={graphRef} className="w-full h-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Entity Connections</CardTitle>
                        <CardDescription>Detailed connections and mentions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-2">External Connections</h3>
                                <div className="flex flex-wrap gap-2">
                                    {forensicData.forensic_analysis.external_connections.usernames.map((username, index) => (
                                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-3 h-3"
                                            >
                                                <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                            </svg>
                                            @{username}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Mentioned Persons</h3>
                                <div className="flex flex-wrap gap-2">
                                    {forensicData.entity_extraction.persons.map((person, index) => (
                                        <Badge key={index} variant="secondary">{person}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Mentioned Organizations</h3>
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
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Potential Interests and Affiliations</CardTitle>
                    <CardDescription>Inferred interests and connections</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Potential Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {forensicData.inferred_analysis.potential_interests.map((interest, index) => (
                                    <TooltipProvider key={index}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="outline">{interest.interest}</Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{interest.reasoning}</p>
                                                <Separator/>
                                                <p>Confidence: {interest.confidence}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Potential Affiliations</h3>
                            {forensicData.inferred_analysis.potential_affiliations.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {forensicData.inferred_analysis.potential_affiliations.map((affiliation, index) => (
                                        // <Badge key={index} variant="outline">{affiliation}</Badge>
                                        <TooltipProvider key={index}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge variant="outline">{affiliation.affiliation}</Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{affiliation.reasoning}</p>
                                                    <Separator/>
                                                    <p>Confidence: {affiliation.confidence}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}



                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No affiliations detected</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">Potential Skills</h3>
                        {forensicData.inferred_analysis.potential_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {forensicData.inferred_analysis.potential_skills.map((skill, index) => (
                                    <TooltipProvider key={index}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="outline">{skill.skill}</Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{skill.reasoning}</p>
                                                <Separator/>
                                                <p>Confidence: {skill.confidence}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No specific skills detected</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}