'use client';

import React, { useState } from 'react';
import { IndianRupee, Calculator, Percent, Calendar, Sparkles } from 'lucide-react';
import { formatIndianPrice, formatIndianNumber } from '@/utils/formatters';

interface EmiCalculatorProps {
  propertyPrice: number;
  listingType?: 'rent' | 'buy';
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  propertyPrice,
  listingType = 'buy',
}) => {
  const [loanAmount, setLoanAmount] = useState(
    listingType === 'buy' ? Math.round(propertyPrice * 0.8) : 500000
  );
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% p.a.
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // Calculate EMI: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  const emi =
    monthlyRate === 0
      ? loanAmount / totalMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const downPayment = Math.max(0, propertyPrice - loanAmount);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {listingType === 'buy' ? 'Home Loan EMI Calculator' : 'Rent Affordability Calculator'}
            </h3>
            <p className="text-xs text-slate-500">Plan your monthly financial commitments</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
          Rates from 8.5%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Sliders Area */}
        <div className="md:col-span-2 space-y-5">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Loan Amount</span>
              <span className="text-rose-600 font-bold">₹{formatIndianNumber(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={Math.max(propertyPrice, 50000000)}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹1 Lac</span>
              <span>₹5 Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Annual Interest Rate</span>
              <span className="text-rose-600 font-bold">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min={6.5}
              max={14.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>6.5%</span>
              <span>14%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Loan Tenure</span>
              <span className="text-rose-600 font-bold">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>5 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-medium">
              Estimated Monthly EMI
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 mt-1">
              ₹{formatIndianNumber(Math.round(emi))}
              <span className="text-xs text-slate-400 font-normal"> / mo</span>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Principal Amount:</span>
              <span className="font-semibold text-slate-200">₹{formatIndianNumber(loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Interest:</span>
              <span className="font-semibold text-slate-200">₹{formatIndianNumber(Math.round(totalInterest))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Amount:</span>
              <span className="font-bold text-white">₹{formatIndianNumber(Math.round(totalPayment))}</span>
            </div>
            {listingType === 'buy' && (
              <div className="flex justify-between border-t border-slate-800/80 pt-1.5 text-emerald-400">
                <span>Down Payment (20%):</span>
                <span className="font-bold">₹{formatIndianNumber(downPayment)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
