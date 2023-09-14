require "application_system_test_case"

class SurveysTest < ApplicationSystemTestCase
  setup do
    @user = users(:member)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    @survey = survey_surveys(:one)
    sign_in @user
  end

  def page_url
    surveys_url(script_name: "/#{@account.id}")
  end

  def surveys_page_url
    survey_url(script_name: "/#{@account.id}", id: @survey.id)
  end

  test "can show index if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: "Select Survey"
    assert_text "Add New Survey"
  end

  test "can not show index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can show survey detail page" do
    visit page_url
    find(id: dom_id(@survey)).click_link("Show")
    within "#survey-header" do
      assert_text @survey.name
      assert_text "Actions"
    end
    take_screenshot
  end

  test "can attempt a survey" do
    visit surveys_page_url
    within "#survey-header" do
      click_on "Actions"
      click_on "Attempt"
    end
    assert_text "Enter Participant Details"
  end

  test "can create a new survey" do
    visit page_url
    click_on "New Survey"
    fill_in "survey_survey_name", with: "Survey Campaign"
    fill_in "survey_survey_description", with: "This is a sample Survey Description"
    select "Score", from: "survey_survey_survey_type"
    click_on "Add Survey"
    take_screenshot
    assert_text "Survey Campaign"
  end

  test "can not create with empty Name Discription survey_type" do
    visit page_url
    click_on "New Survey"
    assert_selector "h3", text: "Add New Survey"
    click_on "Add Survey"
    take_screenshot
    assert_selector "h3", text: "Add New Survey"
  end

  test "can edit a survey" do
    visit page_url
    find(id: dom_id(@survey)).click_link("Edit")
    assert_selector "h3", text: "Edit Survey"
    fill_in "survey_survey_name", with: "Survey Campaigning"
    click_on "Edit Survey"
    assert_text "Survey Campaigning"
  end

  test "can pin a survey" do
    visit surveys_page_url
    within "#survey-header" do
      click_on "Actions"
      click_on "Pin Survey"
    end
    assert_text "Survey has been pinned."
  end

  test "can unpin a survey" do
    pinned = survey_surveys(:pinned)
    visit survey_url(script_name: "/#{pinned.account.id}", id: pinned.id)
    within "#survey-header" do
      click_on "Actions"
      click_on "Unpin Survey"
    end
    assert_text "Survey has been unpinned."
  end

  test "can not edit a survey with invalid name" do
    visit page_url
    find(id: dom_id(@survey)).click_link("Edit")
    assert_selector "h3", text: "Edit Survey"
    fill_in "survey_survey_name", with: ""
    click_on "Edit Survey"
    take_screenshot
  end

  test "can clone a survey" do
    visit page_url
    find(id: dom_id(@survey)).click_link(@survey.name)
    within "#survey-header" do
      click_on "Actions"
      page.accept_confirm do
        click_on "Clone"
      end
    end
    take_screenshot
    assert_text "#{@survey.name} (Copy)"
  end

  test "can restore archived survey" do
    archived = survey_surveys(:archived)
    visit archived_surveys_path(script_name: "/#{archived.account.id}")
    within "tr##{dom_id(archived)}" do
      page.accept_confirm do
        click_on "Unarchive"
      end
    end
    assert_text "Survey has been restored."
  end

  test "can archive a survey" do
    visit page_url
    survey = survey_surveys(:two)
    within "tr##{dom_id(survey)}" do
      page.accept_confirm do
        click_on "Archive"
      end
    end
    assert_text "Survey has been archived."
  end

  test "can delete archived survey" do
    archived = survey_surveys(:archived)
    visit archived_surveys_path(script_name: "/#{archived.account.id}")
    within "tr##{dom_id(archived)}" do
      page.accept_confirm do
        click_on "Delete"
      end
    end
    assert_text "Survey has been deleted."
    take_screenshot
  end
end
