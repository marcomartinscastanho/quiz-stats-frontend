import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "../auth/axios";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Textarea } from "../components/ui/Textarea";
import type { PredictedTopic, PredictedTopicRequest, PredictedTopicUser } from "../types/topics";
import type { User } from "../types/user";

export const PredictionPage = () => {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [topicsText, setTopicsText] = useState<string>("");
  const [result, setResult] = useState<PredictedTopic[]>([]);

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<User[]>("/users/");
      console.log("HEY HO", res);

      return res.data;
    },
  });

  const mutation = useMutation<PredictedTopic[], Error, PredictedTopicRequest>({
    mutationFn: async (body: PredictedTopicRequest): Promise<PredictedTopic[]> => {
      const res = await axios.post<PredictedTopic[]>("/quizzes/stats/predict/", body);
      return res.data;
    },
    onSuccess: data => {
      setResult(data);
    },
  });

  const toggleUser = (id: number) => {
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]));
  };

  const handleSubmit = () => {
    const topics = topicsText
      .split(/\n|,/)
      .map(t => t.trim())
      .filter(t => t);
    mutation.mutate({ user_ids: selectedUserIds, topics });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Predict xT</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Select Users</h2>
        <div className="flex flex-wrap gap-2">
          {users?.map((user: User) => (
            <Button
              key={user.id}
              variant={selectedUserIds.includes(user.id) ? "selected" : "outline"}
              onClick={() => toggleUser(user.id)}
            >
              {user.username}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Topics</h2>
        <Textarea
          rows={12}
          value={topicsText}
          onChange={e => setTopicsText(e.target.value)}
          placeholder="Paste one topic per line or comma-separated"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={mutation.isPending || selectedUserIds.length === 0 || topicsText.trim() === ""}
      >
        {mutation.isPending ? "Predicting..." : "Submit"}
      </Button>

      {mutation.isError && <p className="text-red-600 mt-2">Error: {mutation.error?.message}</p>}

      {result.length > 0 && (
        <div className="grid gap-4 mt-6">
          {result.map((topic: PredictedTopic) => (
            <Card key={topic.topic_name}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{topic.topic_name}</h3>
                <p className="text-sm text-muted-foreground">Categories: {topic.categories.join(", ")}</p>
                <p className="mt-2 font-medium">Predicted Team xT: {topic.predicted_team_xT.toFixed(1)}</p>
                <ul className="mt-2 text-sm space-y-1">
                  {topic.users.map((u: PredictedTopicUser) => (
                    <li key={u.id}>
                      {u.username}: {u.predicted_user_xT.toFixed(1)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
