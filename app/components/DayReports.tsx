"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, DollarSign, Package, Users, Download, ArrowLeft, ArrowRight } from "lucide-react"

export default function DayReports() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Sample data for the selected day
  const dayData = {
    date: selectedDate,
    totalRevenue: 8450,
    totalCost: 4200,
    netProfit: 4250,
    profitMargin: 50.3,
    snacksProduced: [
      { name: "Singara", quantity: 180, revenue: 2700, cost: 1530, profit: 1170 },
      { name: "Roll", quantity: 95, revenue: 2375, cost: 1187, profit: 1188 },
      { name: "Shawarma", quantity: 55, revenue: 1925, cost: 990, profit: 935 },
      { name: "Samosa", quantity: 140, revenue: 1680, cost: 910, profit: 770 },
    ],
    ingredientsUsed: [
      { name: "Flour", quantity: 12.5, unit: "kg", cost: 562 },
      { name: "Sugar", quantity: 4.2, unit: "kg", cost: 252 },
      { name: "Cooking Oil", quantity: 6.8, unit: "L", cost: 816 },
      { name: "Masala Mix", quantity: 2.1, unit: "kg", cost: 420 },
      { name: "Onion", quantity: 8.5, unit: "kg", cost: 340 },
    ],
    employeeAttendance: [
      { name: "Ahmed Rahman", status: "Present", hours: 8 },
      { name: "Fatima Khatun", status: "Present", hours: 8 },
      { name: "Mohammad Ali", status: "Leave", hours: 0 },
    ],
    expenses: [
      { category: "Ingredients", amount: 2390 },
      { category: "Labor", amount: 1500 },
      { category: "Utilities", amount: 200 },
      { category: "Other", amount: 110 },
    ],
  }

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Report</h1>
          <p className="text-gray-600">Detailed breakdown for selected day</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateDate("prev")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Day
            </Button>

            <div className="flex items-center space-x-4">
              <Label htmlFor="reportDate">Select Date:</Label>
              <Input
                id="reportDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>

            <Button variant="outline" onClick={() => navigateDate("next")}>
              Next Day
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
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
                <p className="text-2xl font-bold text-green-600">Tk{dayData.totalRevenue.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-blue-600">Tk{dayData.netProfit.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-purple-600">
                  {dayData.snacksProduced.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
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
                <p className="text-2xl font-bold text-orange-600">{dayData.profitMargin}%</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Production Breakdown</CardTitle>
            <CardDescription>Snacks produced and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dayData.snacksProduced.map((snack, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{snack.name}</span>
                    <Badge variant="outline">{snack.quantity} units</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-green-600">Revenue</p>
                      <p className="font-semibold">Tk{snack.revenue}</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-red-600">Cost</p>
                      <p className="font-semibold">Tk{snack.cost}</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-blue-600">Profit</p>
                      <p className="font-semibold">Tk{snack.profit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Used */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients Consumed</CardTitle>
            <CardDescription>Raw materials used today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayData.ingredientsUsed.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{ingredient.name}</p>
                    <p className="text-sm text-gray-600">
                      {ingredient.quantity} {ingredient.unit}
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
                  <span>Tk{dayData.ingredientsUsed.reduce((sum, item) => sum + item.cost, 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Employee Attendance
            </CardTitle>
            <CardDescription>Staff attendance for the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayData.employeeAttendance.map((employee, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.hours} hours</p>
                  </div>
                  <Badge variant={employee.status === "Present" ? "default" : "secondary"}>{employee.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Daily cost categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayData.expenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{expense.category}</span>
                  <span className="font-semibold">Tk{expense.amount}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Expenses</span>
                  <span>Tk{dayData.expenses.reduce((sum, item) => sum + item.amount, 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
