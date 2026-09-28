"use client";

import { useEffect, useState } from "react";
import { getFoundationRecords } from "@/app/actions/foundation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Users, ClipboardList } from "lucide-react";

type RecordType = "beneficiaries" | "exits";
type FoundationRecord = Record<string, unknown> & { id: string };

const fieldLabel = (field: string) =>
  field.replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase());

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "None";
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}

function RecordList({ type, records }: { type: RecordType; records: FoundationRecord[] }) {
  const isBeneficiary = type === "beneficiaries";
  const titleField = isBeneficiary ? "fullName" : "beneficiaryFullName";
  const registrationField = isBeneficiary ? "registrationNumber" : "beneficiaryRegistrationNumber";

  if (records.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-500">No {isBeneficiary ? "beneficiary registrations" : "exit requests"} have been submitted.</p>;
  }

  return (
    <div className="divide-y divide-gray-200">
      {records.map((record) => {
        const photo = isBeneficiary && typeof record.photo === "string" ? record.photo : null;
        const status = String(record.status || "Submitted").replaceAll("_", " ");

        return (
          <details key={record.id} className="group py-4 first:pt-0 last:pb-0">
            <summary className="flex cursor-pointer list-none items-center gap-3">
              {photo ? (
                <img src={photo} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  {isBeneficiary ? <Users className="h-5 w-5" /> : <ClipboardList className="h-5 w-5" />}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{displayValue(record[titleField])}</p>
                <p className="truncate text-sm text-gray-500">
                  {displayValue(record[registrationField])}
                  {isBeneficiary && record.school ? ` · ${String(record.school)}` : ""}
                  {!isBeneficiary && record.dateOfExit ? ` · Exit date ${String(record.dateOfExit)}` : ""}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0 capitalize">{status.toLowerCase()}</Badge>
              <span className="ml-1 text-sm text-blue-700 group-open:hidden">View</span>
              <span className="ml-1 hidden text-sm text-blue-700 group-open:inline">Close</span>
            </summary>
            <dl className="mt-4 grid gap-x-8 gap-y-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(record)
                .filter(([field]) => field !== "id" && field !== "photo")
                .map(([field, value]) => (
                  <div key={field} className="min-w-0">
                    <dt className="text-xs font-medium uppercase text-gray-500">{fieldLabel(field)}</dt>
                    <dd className="mt-1 break-words text-sm text-gray-900">{displayValue(value)}</dd>
                  </div>
                ))}
            </dl>
          </details>
        );
      })}
    </div>
  );
}

export default function FoundationRecords({ type }: { type: RecordType }) {
  const [beneficiaries, setBeneficiaries] = useState<FoundationRecord[]>([]);
  const [exits, setExits] = useState<FoundationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    const result = await getFoundationRecords();
    if (result.success && result.data) {
      setBeneficiaries(result.data.beneficiaries as FoundationRecord[]);
      setExits(result.data.exits as FoundationRecord[]);
    } else {
      setError(result.message || "Unable to load Foundation records.");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadRecords();
  }, []);

  const records = type === "beneficiaries" ? beneficiaries : exits;
  const isBeneficiary = type === "beneficiaries";

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-gray-100">
        <div>
          <CardTitle>{isBeneficiary ? "Beneficiary registrations" : "Beneficiary exit requests"}</CardTitle>
          <p className="mt-1 text-sm text-gray-500">{records.length} record{records.length === 1 ? "" : "s"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadRecords()} disabled={loading} aria-label="Refresh records">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-5">
        {loading ? <p className="py-12 text-center text-sm text-gray-500">Loading records...</p> : null}
        {!loading && error ? <p role="alert" className="py-8 text-center text-sm text-red-700">{error}</p> : null}
        {!loading && !error ? <RecordList type={type} records={records} /> : null}
      </CardContent>
    </Card>
  );
}