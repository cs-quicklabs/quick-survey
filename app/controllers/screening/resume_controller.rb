class Screening::ResumeController < ApplicationController
  def index
    file = File.read("./json/resume.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
