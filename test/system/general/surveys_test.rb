require "application_system_test_case"

class SurveysTest < ApplicationSystemTestCase
  setup do
    @user = users(:regular)
    @survey = survey_surveys(:user)
    sign_in @user
  end

  def page_url
    surveys_url
  end

  def surveys_page_url
    survey_questions_url(survey_id: @survey.id)
  end

  test "can show index if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: "Select Survey"
    assert_text "New Survey"
  end

  test "can not show index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can show survey detail page" do
    visit page_url
    find(id: dom_id(@survey)).click
    within "#survey-header" do
      assert_text "Attempt"
      assert_text "Clone"
    end
    take_screenshot
  end

  test "can create a new survey" do
    visit page_url
    click_on "New Survey"
    fill_in "Name", with: "Survey Campaign"
    fill_in "Description", with: "This is a sample Survey Description"
    select "KPIs", from: "survey_survey_survey_type"
    select "Employee", from: "survey_survey_survey_for"
    click_on "Add Survey"
    take_screenshot
    assert_selector "p.notice", text: "Survey was created successfully."
  end

  test "can not create with empty Name Discription survey_type survey_for" do
    visit page_url
    click_on "New Survey"
    assert_selector "h1", text: "Add New Survey"
    click_on "Add Survey"
    take_screenshot
    assert_selector "h1", text: "Add New Survey"
  end

  test "can edit a survey" do
    visit page_url
    find(id: dom_id(@survey)).click
    within "#survey-header" do
      click_on "Edit"
    end
    assert_selector "h1", text: "Edit Survey"
    fill_in "Name", with: "Survey Campaigning"
    click_on "Edit Survey"
    assert_selector "p.notice", text: "Survey was updated successfully."
  end

  test "can not edit a survey with invalid name" do
    visit page_url
    find(id: dom_id(@survey)).click
    within "#survey-header" do
      click_on "Edit"
    end
    assert_selector "h1", text: "Edit Survey"
    fill_in "Name", with: ""
    click_on "Edit Survey"
    take_screenshot
  end

  test "can clone a survey" do
    visit page_url
    find(id: dom_id(@survey)).click
    within "#survey-header" do
      click_on "Clone"
    end
    take_screenshot
    assert_selector "p.notice", text: "Survey was cloned successfully."
  end

  test "can delete survey" do
    visit page_url
    find(id: dom_id(@survey)).click
    within "#survey-header" do
      click_on "Delete"
    end
    take_screenshot
    assert_selector "p.notice", text: "Survey was removed successfully."
  end
end
