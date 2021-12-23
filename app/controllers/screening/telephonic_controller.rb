class Screening::TelephonicController < ApplicationController
  def index
    file = File.read("./json/telephonic.json")
    @data = JSON.parse(file, object_class: Job)
  end
end
