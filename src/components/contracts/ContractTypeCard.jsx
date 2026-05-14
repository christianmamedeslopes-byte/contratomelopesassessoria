import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ContractTypeCard({ type, onClick, index }) {
  const Icon = type.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => onClick(type.id)}
      className="group text-left bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center", type.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      </div>
      <h3 className="font-heading font-semibold text-foreground mb-2">{type.label}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
    </motion.button>
  );
}
