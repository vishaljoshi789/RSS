"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Award,
  UserCheck,
  User,
  Search,
  RefreshCcw,
  Network,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAxios from "@/hooks/use-axios";

interface Position {
  id: number;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  is_filled: boolean;
}

interface Pad {
  id: number;
  name: string;
  description: string;
  level: number;
  total_positions: number;
  filled_positions: number;
  positions: Position[];
}

interface Level {
  id: number;
  name: string;
  description: string;
  category: number;
  order: number;
  pads: Pad[];
}

interface Category {
  id: number;
  name: string;
  description: string;
  levels: Level[];
}

const HierarchyTree = () => {
  const axios = useAxios();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set());
  const [expandedPads, setExpandedPads] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    // TODO: Uncomment when API is ready
    // try {
    //   setLoading(true);
    //   const response = await axios.get("/volunteer/hierarchy/");
    //   setCategories(response.data.results || response.data || []);
    // } catch (error: any) {
    //   toast.error(error.response?.data?.message || "Failed to fetch hierarchy");
    // } finally {
    //   setLoading(false);
    // }

    // Dummy data for now
    setLoading(true);
    setTimeout(() => {
      const dummyData: Category[] = [
        {
          id: 1,
          name: "Shakha Level",
          description: "Local branch level volunteers",
          levels: [
            {
              id: 1,
              name: "Junior Level",
              description: "Entry level positions",
              category: 1,
              order: 1,
              pads: [
                {
                  id: 1,
                  name: "Swayamsevak",
                  description: "Basic volunteer",
                  level: 1,
                  total_positions: 5,
                  filled_positions: 3,
                  positions: [
                    {
                      id: 1,
                      user: {
                        id: 1,
                        name: "Rajesh Kumar",
                        email: "rajesh@example.com",
                        phone: "+91 98765 43210",
                      },
                      is_filled: true,
                    },
                    {
                      id: 2,
                      user: {
                        id: 2,
                        name: "Amit Sharma",
                        email: "amit@example.com",
                        phone: "+91 98765 43211",
                      },
                      is_filled: true,
                    },
                    {
                      id: 3,
                      user: {
                        id: 3,
                        name: "Suresh Patil",
                        email: "suresh@example.com",
                        phone: "+91 98765 43212",
                      },
                      is_filled: true,
                    },
                    {
                      id: 4,
                      is_filled: false,
                    },
                    {
                      id: 5,
                      is_filled: false,
                    },
                  ],
                },
                {
                  id: 2,
                  name: "Sahayak",
                  description: "Assistant volunteer",
                  level: 1,
                  total_positions: 3,
                  filled_positions: 2,
                  positions: [
                    {
                      id: 6,
                      user: {
                        id: 4,
                        name: "Vikram Singh",
                        email: "vikram@example.com",
                        phone: "+91 98765 43213",
                      },
                      is_filled: true,
                    },
                    {
                      id: 7,
                      user: {
                        id: 5,
                        name: "Pradeep Joshi",
                        email: "pradeep@example.com",
                        phone: "+91 98765 43214",
                      },
                      is_filled: true,
                    },
                    {
                      id: 8,
                      is_filled: false,
                    },
                  ],
                },
              ],
            },
            {
              id: 2,
              name: "Senior Level",
              description: "Experienced volunteers",
              category: 1,
              order: 2,
              pads: [
                {
                  id: 3,
                  name: "Mukhya Shikshak",
                  description: "Chief instructor",
                  level: 2,
                  total_positions: 2,
                  filled_positions: 1,
                  positions: [
                    {
                      id: 9,
                      user: {
                        id: 6,
                        name: "Ramesh Gupta",
                        email: "ramesh@example.com",
                        phone: "+91 98765 43215",
                      },
                      is_filled: true,
                    },
                    {
                      id: 10,
                      is_filled: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: "Zila Level",
          description: "District level coordination",
          levels: [
            {
              id: 3,
              name: "District Coordination",
              description: "District level management",
              category: 2,
              order: 1,
              pads: [
                {
                  id: 4,
                  name: "Zila Karyavah",
                  description: "District secretary",
                  level: 3,
                  total_positions: 1,
                  filled_positions: 1,
                  positions: [
                    {
                      id: 11,
                      user: {
                        id: 7,
                        name: "Mahesh Verma",
                        email: "mahesh@example.com",
                        phone: "+91 98765 43216",
                      },
                      is_filled: true,
                    },
                  ],
                },
                {
                  id: 5,
                  name: "Zila Pracharak",
                  description: "District organizer",
                  level: 3,
                  total_positions: 2,
                  filled_positions: 0,
                  positions: [
                    {
                      id: 12,
                      is_filled: false,
                    },
                    {
                      id: 13,
                      is_filled: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      setCategories(dummyData);
      setLoading(false);
    }, 500);
  };

  const toggleCategory = (id: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleLevel = (id: number) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLevels(newExpanded);
  };

  const togglePad = (id: number) => {
    const newExpanded = new Set(expandedPads);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPads(newExpanded);
  };

  const expandAll = () => {
    setExpandedCategories(new Set(categories.map((c) => c.id)));
    setExpandedLevels(
      new Set(categories.flatMap((c) => c.levels.map((l) => l.id)))
    );
    setExpandedPads(
      new Set(
        categories.flatMap((c) =>
          c.levels.flatMap((l) => l.pads.map((p) => p.id))
        )
      )
    );
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedLevels(new Set());
    setExpandedPads(new Set());
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading hierarchy...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Volunteer Hierarchy</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
            <Button variant="outline" size="sm" onClick={fetchHierarchy}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search wings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Network className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="font-semibold text-lg mb-1">
                {searchTerm ? "No results found" : "No hierarchy available"}
              </h3>
              <p className="text-sm mb-4">
                {searchTerm
                  ? `No results matching "${searchTerm}"`
                  : "Create wings, levels, and designations to see the hierarchy"}
              </p>
              {!searchTerm && (
                <Button variant="outline" size="sm" onClick={fetchHierarchy}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              )}
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div
                  className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer border"
                  onClick={() => toggleCategory(category.id)}
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  {expandedCategories.has(category.id) ? (
                    <FolderOpen className="h-6 w-6 text-primary" />
                  ) : (
                    <Folder className="h-6 w-6 text-primary" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{category.name}</span>
                      <Badge variant="secondary">
                        {category.levels?.length || 0} Levels
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {expandedCategories.has(category.id) &&
                  category.levels?.map((level, levelIndex) => (
                    <div key={level.id} className="relative">
                      <div className="grid grid-cols-[24px_1fr] xs:grid-cols-[32px_1fr] gap-2">
                        <div className="relative flex justify-center">
                          {levelIndex < category.levels!.length && (
                            <div className="absolute top-0 bottom-0 w-[1px] bg-border"></div>
                          )}

                          <div className="absolute top-6 left-[50%] w-[calc(50%)] h-[12px] border-0 border-l border-b border-border rounded-bl-[12px]"></div>
                        </div>

                        <div className="space-y-2 pb-2">
                          <div
                            className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer border"
                            onClick={() => toggleLevel(level.id)}
                          >
                            {expandedLevels.has(level.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Award className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {level.name}
                                </span>
                                <Badge variant="outline">
                                  Order: {level.order}
                                </Badge>
                                <Badge variant="secondary">
                                  {level.pads?.length || 0} Pads
                                </Badge>
                              </div>
                              {level.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {level.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {expandedLevels.has(level.id) &&
                            level.pads?.map((pad, padIndex) => (
                              <div key={pad.id} className="relative">
                                <div className="grid grid-cols-[24px_1fr] xs:grid-cols-[32px_1fr] gap-2">
                                  <div className="relative flex justify-center">
                                    {padIndex < level.pads!.length && (
                                      <div className="absolute top-0 bottom-0 w-[1px] bg-border"></div>
                                    )}

                                    <div className="absolute top-6 left-[50%] w-[calc(50%)] h-[12px] border-0 border-l border-b border-border rounded-bl-[12px]"></div>
                                  </div>

                                  <div className="space-y-2 pb-2">
                                    <div
                                      className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer border"
                                      onClick={() => togglePad(pad.id)}
                                    >
                                      {expandedPads.has(pad.id) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      <UserCheck className="h-5 w-5 text-primary" />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {pad.name}
                                          </span>
                                          <Badge
                                            variant={
                                              pad.filled_positions ===
                                              pad.total_positions
                                                ? "default"
                                                : pad.filled_positions > 0
                                                ? "secondary"
                                                : "outline"
                                            }
                                          >
                                            {pad.filled_positions}/
                                            {pad.total_positions} Filled
                                          </Badge>
                                        </div>
                                        {pad.description && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {pad.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {expandedPads.has(pad.id) && (
                                      <div className="pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                          {pad.positions?.map(
                                            (position, index) => (
                                              <div
                                                key={position.id}
                                                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                                  position.is_filled
                                                    ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg hover:border-green-300"
                                                    : "border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:shadow-md hover:border-gray-400"
                                                }`}
                                              >
                                                <div className="absolute top-3 right-3">
                                                  <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                                                      position.is_filled
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-300 text-gray-600"
                                                    }`}
                                                  >
                                                    #{index + 1}
                                                  </div>
                                                </div>

                                                <div className="p-5">
                                                  {position.user ? (
                                                    <div className="space-y-3">
                                                      <div className="flex items-start gap-3">
                                                        <div className="relative">
                                                          <Avatar className="h-14 w-14 ring-4 ring-white shadow-md">
                                                            <AvatarImage
                                                              src={
                                                                position.user
                                                                  ?.avatar
                                                              }
                                                            />
                                                            <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white font-semibold text-lg">
                                                              {position.user.name
                                                                .split(" ")
                                                                .map(
                                                                  (n) => n[0]
                                                                )
                                                                .join("")
                                                                .toUpperCase()}
                                                            </AvatarFallback>
                                                          </Avatar>

                                                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"></div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                          <h4 className="font-semibold text-gray-900 text-base mb-0.5 truncate">
                                                            {position.user.name}
                                                          </h4>
                                                          <p className="text-xs text-green-600 font-medium">
                                                            Active Volunteer
                                                          </p>
                                                        </div>
                                                      </div>

                                                      <div className="space-y-2 pt-2 border-t border-green-100">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100">
                                                            <svg
                                                              className="h-4 w-4 text-green-600"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              stroke="currentColor"
                                                            >
                                                              <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                              />
                                                            </svg>
                                                          </div>
                                                          <span className="truncate text-xs">
                                                            {
                                                              position.user
                                                                .email
                                                            }
                                                          </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100">
                                                            <svg
                                                              className="h-4 w-4 text-green-600"
                                                              fill="none"
                                                              viewBox="0 0 24 24"
                                                              stroke="currentColor"
                                                            >
                                                              <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                              />
                                                            </svg>
                                                          </div>
                                                          <span className="text-xs font-medium">
                                                            {
                                                              position.user
                                                                .phone
                                                            }
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                                                        <User className="h-8 w-8 text-gray-400" />
                                                      </div>
                                                      <p className="text-sm font-medium text-gray-500 mb-1">
                                                        Position Vacant
                                                      </p>
                                                      <p className="text-xs text-gray-400">
                                                        Awaiting assignment
                                                      </p>
                                                    </div>
                                                  )}
                                                </div>

                                                {position.is_filled && (
                                                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HierarchyTree;
