import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
export interface Compound {
  props: Array<{
    urn: { label: string; name: string; release: string };
    value: Object;
  }>;
}
export interface IResults {
  PC_Compounds: Array<Compound>;
}

export default function ChemicalExplorer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<Compound> | []>();
  const [loading, setLoading] = useState(false);

  const searchCompounds = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${query}/JSON`
      );
      const data = await response.json();
      console.log(data);
      if (data.PC_Compounds) {
        setResults(data.PC_Compounds);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chemical Compound Explorer</h1>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter compound name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={searchCompounds} disabled={loading}>
          <Search className="w-5 h-5" />
        </Button>
      </div>
      {loading && <p>Loading...</p>}
      <div className="grid gap-4">
        {results?.map((compound: Compound, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-4">
                {compound?.props.map((v, k) => (
                  <div key={k} className="flex flex-col gap-2">
                    <h3>{JSON.stringify(v.urn)}</h3>
                    <p>{JSON.stringify(v.value)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
