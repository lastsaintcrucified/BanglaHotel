"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, DollarSign, Package, Users, Calendar, Download, Filter } from "lucide-react"

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: "2024-01-31",
  })

  const monthlyData = {
    totalRevenue: 185420,
    totalCost: 98650,
    netProfit: 86770,
    profitMargin: 46.8,
    totalSnacksProduced: 12450,
    employeeCosts: 45000,
    ingredientUsage: [
      { name: "Flour", used: 45, unit: "kg", cost: 2025 },
      { name: "Sugar", used: 18, unit: "kg", cost: 1080 },
      { name: "Cooking Oil", used: 25, unit: "L", cost: 3000 },
      { name: "Masala Mix", used: 8, unit: "kg", cost: 1600 },
      { name: "Onion", used: 35, unit: "kg", cost: 1400 },
      { name: "Salt", used: 5, unit: "kg", cost: 125 },
    ],
    snackProduction: [
      { name: "Singara", quantity: 4200, revenue: 63000, cost: 35700, profit: 27300 },
      { name: "Roll", quantity: 2800, revenue: 70000, cost: 35000, profit: 35000 },
      { name: "Shawarma", quantity: 1850, revenue: 64750, cost: 33300, profit: 31450 },
      { name: "Samosa", quantity: 3600, revenue: 43200, cost: 23400, profit: 19800 },
    ],
    employeeSummary: [
      { name: "Ahmed Rahman", salary: 15000, advances: 5000, leaves: 2 },
      { name: "Fatima Khatun", salary: 12000, advances: 0, leaves: 1 },
      { name: "Mohammad Ali", salary: 18000, advances: 5000, leaves: 0 },
    ],
  }

  const topPerformingSnack = monthlyData.snackProduction.reduce((prev, current) =>
    prev.profit > current.profit ? prev : current,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Reports</h1>
          <p className="text-gray-600">Comprehensive business analytics and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Report Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <Button>Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">Tk{monthlyData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600">Tk{monthlyData.netProfit.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Produced</p>
                <p className="text-2xl font-bold text-purple-600">{monthlyData.totalSnacksProduced.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-orange-600">{monthlyData.profitMargin}%</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Snack Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Snack Performance</CardTitle>
            <CardDescription>Revenue and profit breakdown by snack type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.snackProduction.map((snack, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{snack.name}</span>
                    <Badge variant={snack.name === topPerformingSnack.name ? "default" : "outline"}>
                      {snack.quantity} units
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-green-600">Revenue</p>
                      <p className="font-semibold">Tk{snack.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-red-600">Cost</p>
                      <p className="font-semibold">Tk{snack.cost.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-blue-600">Profit</p>
                      <p className="font-semibold">Tk{snack.profit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ingredient Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Usage</CardTitle>
            <CardDescription>Monthly consumption and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.ingredientUsage.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-sm text-gray-600">
                      {ingredient.used} {ingredient.unit} used
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Tk{ingredient.cost}</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Ingredient Cost</span>
                  <span>
                    Tk{monthlyData.ingredientUsage.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Employee Summary
          </CardTitle>
          <CardDescription>Monthly salary and attendance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Employee</th>
                  <th className="text-right p-2">Salary</th>
                  <th className="text-right p-2">Advances</th>
                  <th className="text-right p-2">Leaves</th>
                  <th className="text-right p-2">Net Pay</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.employeeSummary.map((employee, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{employee.name}</td>
                    <td className="p-2 text-right">Tk{employee.salary.toLocaleString()}</td>
                    <td className="p-2 text-right">Tk{employee.advances.toLocaleString()}</td>
                    <td className="p-2 text-right">{employee.leaves} days</td>
                    <td className="p-2 text-right font-semibold">
                      Tk{(employee.salary - employee.advances).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-b-2 border-gray-300 font-semibold">
                  <td className="p-2">Total</td>
                  <td className="p-2 text-right">
                    Tk{monthlyData.employeeSummary.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    Tk{monthlyData.employeeSummary.reduce((sum, emp) => sum + emp.advances, 0).toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    {monthlyData.employeeSummary.reduce((sum, emp) => sum + emp.leaves, 0)} days
                  </td>
                  <td className="p-2 text-right">
                    Tk
                    {monthlyData.employeeSummary
                      .reduce((sum, emp) => sum + (emp.salary - emp.advances), 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
