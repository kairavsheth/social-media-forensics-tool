// app/dashboard/components/CalendarHeatmap.tsx
"use client";

import React, { /*useEffect,*/ useRef } from 'react';
// import * as d3 from 'd3';

interface CalendarData {
    date: string;
    count: number;
}

interface CalendarHeatmapProps {
    data: CalendarData[];
}

export function CalendarHeatmap({
                                    // data
}: CalendarHeatmapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    //
    // useEffect(() => {
    //     if (!svgRef.current || !data.length) return;
    //
    //     // Clear previous content
    //     d3.select(svgRef.current).selectAll("*").remove();
    //
    //     const width = svgRef.current.clientWidth;
    //     const cellSize = width / 53; // Approximate number of weeks in a year
    //     const height = cellSize * 7 + 30; // 7 days + space for month labels
    //
    //     const svg = d3.select(svgRef.current)
    //         .attr('viewBox', `0 0 ${width} ${height}`)
    //         .attr('width', width)
    //         .attr('height', height);
    //
    //     // Parse the dates
    //     const dates = data.map(d => ({
    //         date: new Date(d.date),
    //         count: d.count
    //     }));
    //
    //     // Find min and max dates
    //     const minDate = d3.min(dates, d => d.date) || new Date();
    //     const maxDate = d3.max(dates, d => d.date) || new Date();
    //
    //     // Create a date range for the calendar
    //     const startDate = new Date(minDate);
    //     startDate.setDate(1);
    //     startDate.setMonth(startDate.getMonth() - 1);
    //
    //     const endDate = new Date(maxDate);
    //     endDate.setMonth(endDate.getMonth() + 1);
    //     endDate.setDate(0);
    //
    //     // Create a color scale
    //     const colorScale = d3.scaleSequential()
    //         .domain([0, d3.max(data, d => d.count) || 1])
    //         .interpolator(d3.interpolateBlues);
    //
    //     // Year format
    //     const formatYear = d3.timeFormat("%Y");
    //     // Month format
    //     const formatMonth = d3.timeFormat("%b");
    //
    //     // Group data by year and month for better organization
    //     const nestedData = d3.groups(dates, d => formatYear(d.date));
    //
    //     let yearOffset = 0;
    //
    //     nestedData.forEach((yearData, yearIndex) => {
    //         const [year, daysInYear] = yearData;
    //
    //         // Add year label
    //         svg.append("text")
    //             .attr("x", 0)
    //             .attr("y", yearOffset + 20)
    //             .attr("font-weight", "bold")
    //             .attr("font-size", "14px")
    //             .text(year);
    //
    //         // Month labels
    //         const monthLabels = svg.append("g")
    //             .attr("text-anchor", "start")
    //             .attr("transform", `translate(30, ${yearOffset + 30})`);
    //
    //         d3.groups(daysInYear, d => d.date.getMonth()).forEach(([month, days]) => {
    //             const firstDay = days[0].date;
    //             monthLabels.append("text")
    //                 .attr("x", d3.timeWeek.count(d3.timeYear(firstDay), firstDay) * cellSize)
    //                 .attr("y", -5)
    //                 .attr("font-size", "10px")
    //                 .text(formatMonth(firstDay));
    //         });
    //
    //         // Day cells
    //         const cellGroup = svg.append("g")
    //             .attr("transform", `translate(30, ${yearOffset + 30})`);
    //
    //         // Create cells for each day
    //         daysInYear.forEach(d => {
    //             const weekOfYear = d3.timeWeek.count(d3.timeYear(d.date), d.date);
    //             const dayOfWeek = d.date.getDay();
    //
    //             cellGroup.append("rect")
    //                 .attr("width", cellSize - 1)
    //                 .attr("height", cellSize - 1)
    //                 .attr("x", weekOfYear * cellSize)
    //                 .attr("y", dayOfWeek * cellSize)
    //                 .attr("fill", d.count > 0 ? colorScale(d.count) : "#eee")
    //                 .attr("stroke", "#fff")
    //                 .attr("rx", 2)
    //                 .append("title")
    //                 .text(`${d.date.toDateString()}: ${d.count} posts`);
    //         });
    //
    //         yearOffset += 160; // Space between years
    //     });
    //
    //     // Add legend
    //     const legend = svg.append("g")
    //         .attr("transform", `translate(${width - 150}, 10)`);
    //
    //     const legendScale = d3.scaleSequential()
    //         .domain([0, 5])
    //         .interpolator(d3.interpolateBlues);
    //
    //     for (let i = 0; i <= 5; i++) {
    //         legend.append("rect")
    //             .attr("width", 20)
    //             .attr("height", 10)
    //             .attr("x", i * 22)
    //             .attr("y", 0)
    //             .attr("fill", legendScale(i))
    //             .attr("stroke", "#fff");
    //
    //         legend.append("text")
    //             .attr("x", i * 22 + 10)
    //             .attr("y", 25)
    //             .attr("text-anchor", "middle")
    //             .attr("font-size", "9px")
    //             .text(i);
    //     }
    //
    //     legend.append("text")
    //         .attr("x", 60)
    //         .attr("y", -5)
    //         .attr("font-size", "10px")
    //         .attr("text-anchor", "middle")
    //         .text("Posts per day");
    //
    // }, [data]);

    return (
        <div className="w-full h-full">
            <svg ref={svgRef} width="100%" height="100%" />
        </div>
    );
}