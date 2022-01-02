class Screening::InterviewController < ApplicationController
  def index
    authorize [:screening, :interview]
    file = File.read("./json/interview.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
