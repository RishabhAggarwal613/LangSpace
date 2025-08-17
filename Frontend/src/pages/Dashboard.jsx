import React from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth) || {};
  const name = user?.name || "Learner";

  const stats = [
    { label: "XP", value: 1420 },
    { label: "Streak", value: "7 days" },
    { label: "Sessions", value: 32 },
    { label: "Accuracy", value: "86%" },
  ];

  const recent = [
    { id: 1, title: "Pronunciation: /θ/ vs /t/", score: "82%" },
    { id: 2, title: "Dialogue: Cafe ordering", score: "A-" },
    { id: 3, title: "Quick Game: Word Rush", score: "910 pts" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid gap-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Welcome back, {name} 👋</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <CardTitle className="opacity-70 text-sm">{s.label}</CardTitle>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 grid place-items-center opacity-70 text-sm border rounded-xl">
              Chart placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <span className="text-sm">{r.title}</span>
                  <span className="text-xs opacity-70">{r.score}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
