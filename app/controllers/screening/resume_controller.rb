class Screening::ResumeController < ApplicationController
  def index
    file = File.read("./resume.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
